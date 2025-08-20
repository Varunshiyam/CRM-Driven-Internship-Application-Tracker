import requests
import re
import os

# GitHub API endpoint for contributors
repo = "Varunshiyam/CRM-Driven-Internship-Application-Tracker"
url = f"https://api.github.com/repos/{repo}/contributors"
headers = {
    "Authorization": f"token {os.getenv('GITHUB_TOKEN')}",
    "Accept": "application/vnd.github.v3+json"
}

# Fetch contributors
response = requests.get(url, headers=headers)
response.raise_for_status()
contributors = response.json()

# Generate HTML for contributors tab
contributor_html = ""
for contributor in contributors:
    contributor_html += f"""
    <div style="display: inline-block; padding: 10px; text-align: center; min-width: 150px;">
      <a href="{contributor['html_url']}" target="_blank" style="text-decoration: none; color: #333;">
        <img src="{contributor['avatar_url']}" alt="{contributor['login']}" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 5px;">
        <div style="font-size: 14px; font-weight: bold;">{contributor['login']}</div>
        <div style="font-size: 12px; color: #666;">{contributor['contributions']} contribution{'s' if contributor['contributions'] != 1 else ''}</div>
      </a>
    </div>
    """

# Contributors section with CSS
contributors_section = f"""
## Contributors

Below is an auto-scrolling tab showcasing our amazing contributors and their contribution counts. (Auto-updated via GitHub Actions)

<div id="contributor-tab" style="overflow-x: hidden; white-space: nowrap; width: 100%; padding: 10px 0; background-color: #f9f9f9; border-radius: 8px;">
  <div id="contributor-list" style="display: inline-block; animation: scroll 20s linear infinite;">
    <!-- Contributor items (original list) -->
    {contributor_html}
    <!-- Duplicated list for seamless infinite scroll -->
    {contributor_html}
  </div>
</div>

<style>
@keyframes scroll {{
  0% {{ transform: translateX(0); }}
  100% {{ transform: translateX(-50%); }}
}}

#contributor-tab::-webkit-scrollbar {{
  display: none; /* Hide scrollbar for cleaner look */
}}

#contributor-list:hover {{
  animation-play-state: paused; /* Pause on hover */
}}

@media (max-width: 600px) {{
  #contributor-list div {{
    min-width: 120px; /* Smaller for mobile */
  }}
  #contributor-list img {{
    width: 40px;
    height: 40px;
  }}
  #contributor-list div div {{
    font-size: 12px; /* Adjust font */
  }}
}}
</style>
"""

# Read current README
with open("README.md", "r", encoding="utf-8") as file:
    content = file.read()

# Replace or insert Contributors section
if "## Contributors" in content:
    new_content = re.sub(
        r"## Contributors\n.*?(\n---\n## 🏁 Getting Started)",
        f"{contributors_section}\\1",
        content,
        flags=re.DOTALL
    )
else:
    new_content = content.replace(
        "\n---\n## 🏁 Getting Started",
        f"\n{contributors_section}\n---\n## 🏁 Getting Started"
    )

# Write updated README
with open("README.md", "w", encoding="utf-8") as file:
    file.write(new_content)