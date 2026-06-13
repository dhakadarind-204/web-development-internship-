from pathlib import Path
import re
path = Path('task2.html')
text = path.read_text(encoding='utf-8')
# Replace first inline style block
text = re.sub(r'<style>.*?</style>\s*', '<link rel="stylesheet" href="task2.css">\n', text, flags=re.DOTALL)
# Remove any old inline script blocks
text = re.sub(r'<!-- ── JavaScript ── -->.*?</script>\s*', '', text, flags=re.DOTALL)
# Ensure one deferred external script tag before </body>
text = text.replace('</body>', '  <script src="task2.js" defer></script>\n</body>')
# Trim any content after closing html
idx = text.find('</html>')
if idx != -1:
    text = text[:idx+7]
path.write_text(text, encoding='utf-8')
print('task2.html rewritten successfully')
