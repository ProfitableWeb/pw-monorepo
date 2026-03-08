"""
PW-038 | Расчёт времени чтения. Очистка HTML/Markdown → подсчёт слов → 200 wpm.
"""

import re

_TAG_RE = re.compile(r"<[^>]+>")
_MD_CODE_BLOCK_RE = re.compile(r"```.*?```", re.DOTALL)
_MD_LINK_RE = re.compile(r"!?\[([^\]]*)\]\([^)]+\)")
_MD_SYNTAX_RE = re.compile(r"[#*_`>~|]")
_MD_HR_RE = re.compile(r"^[-*_]{3,}\s*$", re.MULTILINE)
_WHITESPACE_RE = re.compile(r"\s+")
_WPM = 200


def _strip_markdown(content: str) -> str:
    text = _MD_CODE_BLOCK_RE.sub(" ", content)
    text = _MD_LINK_RE.sub(r"\1", text)
    text = _MD_HR_RE.sub(" ", text)
    text = _MD_SYNTAX_RE.sub("", text)
    return text


def calculate_reading_time(content: str, content_format: str = "html") -> int:
    if not content:
        return 0
    if content_format == "markdown":
        text = _strip_markdown(content)
    else:
        text = _TAG_RE.sub(" ", content)
    words = _WHITESPACE_RE.split(text.strip())
    word_count = len([w for w in words if w])
    minutes = max(1, round(word_count / _WPM))
    return minutes
