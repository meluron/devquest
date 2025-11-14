from datetime import datetime
from IPython.display import display, HTML

def hc(
    title: str,
    keywords: list[str] = [""],
    references: list[tuple[str, str]] | None = None
):
    """
    Display header with a dim calendar card (fits both dark & light modes).
    Optionally includes a numbered list of references below, formatted as [1], [2], etc.
    """

    now = datetime.now()
    day = now.strftime("%d")
    month = now.strftime("%b")
    year = now.strftime("%Y")
    time = now.strftime("%I:%M:%S %p")

    keywords_str = "; ".join(keywords) + ";" if keywords else ""

    if references:
        refs_html = """
        <div class='hc-refs-wrapper'>
            <div class='hc-refs-title'>References</div>
            <div class='hc-refs'>
        """
        for i, (ref_title, ref_link) in enumerate(references, 1):
            # number and text both in blue, with link
            refs_html += f'<div class="hc-ref-item"><span class="hc-ref-num">[{i}]</span> <a href="{ref_link}" target="_blank" class="hc-ref-link">{ref_title}</a></div>'
        refs_html += "</div></div>"
    else:
        refs_html = ""

    html_code = f"""
    <style>
    .hc-wrapper {{
        display: flex;
        align-items: center;
        font-family: 'Georgia', serif;
        border-left: 3px solid #666;
        padding-left: 12px;
        margin-top: 1em;
        margin-bottom: 1em;
        gap: 20px;
    }}
    .hc-calendar {{
        display: inline-block;
        font-family: 'Arial', sans-serif;
        border-radius: 8px;
        overflow: hidden;
        background: #2d2d2d;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        width: 120px;
        font-size: 12px;
        text-align: center;
        flex-shrink: 0;
        border: 1px solid #444;
    }}
    .hc-header {{
        background: #333;
        color: #ddd;
        padding: 4px 0;
        font-weight: bold;
        font-size: 11px;
    }}
    .hc-month {{
        background: #EF8C00;
        color: #fff;
        padding: 5px 0;
        font-weight: bold;
    }}
    .hc-day {{
        background: #3a3a3a;
        color: #eee;
        padding: 8px 0;
        font-size: 20px;
        font-weight: bold;
    }}
    .hc-time {{
        background: #333;
        color: #bbb;
        padding: 4px 0;
        font-size: 12px;
    }}
    .hc-title {{
        margin: 0;
        color: #EF8C00;
        font-size: 1.8em;
        font-weight: 500;
        line-height: 1.2em;
        word-break: break-word;
    }}
    .hc-keywords {{
        margin: 0.5em 0 0 0;
        font-size: 0.9em;
        opacity: 0.8;
    }}
    .hc-refs-wrapper {{
        margin-top: 0.8em;
    }}
    .hc-refs-title {{
        font-weight: bold;
        color: #EF8C00;
        font-size: 1em;
        margin-bottom: 0.3em;
    }}
    .hc-refs {{
        font-size: 0.9em;
        color: #4A90E2;
        line-height: 1.4em;
    }}
    .hc-ref-item {{
        margin-bottom: 0.3em;
    }}
    .hc-ref-num {{
        color: #4A90E2;
        font-weight: bold;
        margin-right: 4px;
    }}
    .hc-ref-link {{
        color: #4A90E2;
        text-decoration: none;
    }}
    .hc-ref-link:hover {{
        text-decoration: underline;
    }}
    </style>

    <div class="hc-wrapper">
        <!-- Calendar -->
        <div class="hc-calendar">
            <div class="hc-header">Last modified</div>
            <div class="hc-month">{month}, {year}</div>
            <div class="hc-day">{day}</div>
            <div class="hc-time">{time}</div>
        </div>
        
        <!-- Header text -->
        <div style="flex: 1;">
            <div class="hc-title">{title}</div>
            <p class="hc-keywords">{keywords_str}</p>
            {refs_html}
        </div>
    </div>
    """

    display(HTML(html_code))
