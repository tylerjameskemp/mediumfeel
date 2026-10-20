"""Regression checks for publication metadata. Run with unittest discovery."""

import contextlib
import importlib.util
import io
from pathlib import Path
import sys
import tempfile
import unittest


SPEC = importlib.util.spec_from_file_location("post_metadata", Path(__file__).with_name("sync-post-metadata.py"))
metadata = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = metadata
SPEC.loader.exec_module(metadata)


class ReaderProseTests(unittest.TestCase):
    def test_only_reader_prose_counts_and_inline_words_remain_intact(self):
        source = """
        <p>Outside article</p><div class="post-content">
          <div class="section-label">Heading</div>
          <p>One <em>two</em> don&rsquo;t break-in-half re<em>join</em>.</p>
          <script>Many fake words: document.querySelector('.post-content');</script>
          <style>.fake { color: green; }</style>
          <nav><a>Another post title</a></nav>
          <figure><span>Animated label</span><figcaption>A caption</figcaption></figure>
          <pre><code>const fake = 'many words';</code></pre>
          <div class="pull-quote"><p>A duplicate quote</p></div>
          <p hidden>Hidden text</p><p aria-hidden="true">Decorative text</p>
          <div class="experiment">Dynamic widget text</div>
          <div data-reading-time-exclude>Explicit exclusion</div>
        </div><p>After article</p>
        """
        self.assertEqual(metadata.PostHTML(source).word_count(), 6)

    def test_missing_empty_or_multiple_article_bodies_fail(self):
        for source in ("<p>No body</p>", '<div class="post-content"></div>',
                       '<div class="post-content">One</div><div class="post-content">Two</div>'):
            with self.subTest(source=source), self.assertRaises(ValueError):
                metadata.PostHTML(source).word_count()


class PublicationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for directory in ("lab/posts", "assets/js"):
            (self.root / directory).mkdir(parents=True)
        field = '<div data-post-slug="example"><span data-post-field="readTime">99 min read</span></div>'
        (self.root / "index.html").write_text(field)
        (self.root / "about.html").write_text("<p>About</p>")
        (self.root / "lab/index.html").write_text(field)
        self.post = self.root / "lab/posts/example.html"
        self.post.write_text(
            '<script type="application/ld+json">{"@type":"BlogPosting", "wordCount":"999", "timeRequired":"PT99M"}</script>'
            + field + '<div class="post-content"><p>' + " ".join(["word"] * 201) + "</p></div>"
        )
        (self.root / "lab/posts/_template.html").write_text("Not a published post")
        (self.root / "assets/js/post-registry.js").write_text(
            "window.POST_REGISTRY = {\n  'example': {\n    readTime: 99\n  }\n};\n"
        )

    def run_helper(self, *args):
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            return metadata.main(["--root", str(self.root), *args])

    def test_stale_check_is_read_only_then_write_is_idempotent(self):
        before = {path: path.read_bytes() for path in self.root.rglob("*") if path.is_file()}
        self.assertEqual(self.run_helper(), 1)
        self.assertEqual(before, {path: path.read_bytes() for path in before})
        self.assertEqual(self.run_helper("--write"), 0)
        originals, expected, counts = metadata.expected_files(self.root)
        self.assertEqual(counts, {"example": (201, 2)})
        self.assertEqual(originals, expected)
        self.assertIn('"wordCount":201', self.post.read_text())
        self.assertIn('"timeRequired":"PT2M"', self.post.read_text())
        for page in ("index.html", "lab/index.html", "lab/posts/example.html"):
            self.assertIn(">2 min read</span>", (self.root / page).read_text())
        self.assertIn("readTime: 2", (self.root / "assets/js/post-registry.js").read_text())
        after = {path: path.read_bytes() for path in before}
        self.assertEqual(self.run_helper("--write"), 0)
        self.assertEqual(after, {path: path.read_bytes() for path in before})
        self.assertEqual(self.run_helper("--check"), 0)

    def test_content_edit_makes_schema_stale_even_without_minute_change(self):
        self.assertEqual(self.run_helper("--write"), 0)
        self.post.write_text(self.post.read_text().replace("</p></div>", " one-more</p></div>"))
        self.assertEqual(self.run_helper("--check"), 1)

    def test_unregistered_post_fails_without_partial_writes(self):
        registry = self.root / "assets/js/post-registry.js"
        registry.write_text(registry.read_text().replace("'example'", "'other-post'"))
        before = self.post.read_bytes()
        self.assertEqual(self.run_helper("--write"), 1)
        self.assertEqual(self.post.read_bytes(), before)


if __name__ == "__main__":
    unittest.main()
