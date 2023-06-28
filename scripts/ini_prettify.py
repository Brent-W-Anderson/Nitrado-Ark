import re

def prettify_ini(input_path, output_path):
    with open(input_path, 'r') as file:
        data = file.read().splitlines()

    pretty_data = []
    indent_level = 0
    for line in data:
        # If line starts with a comment symbol or is an empty line, add it to the output as is
        if line.strip().startswith((';', '#')) or line.strip() == '':
            pretty_data.append(line)
        else:
            # Split the line into entry and comment
            entry_comment_split = re.split(r'([;#].*)', line)
            entry = entry_comment_split[0]
            comment = entry_comment_split[1] if len(entry_comment_split) > 1 else None
            # Apply the regular expression substitutions to make the entry pretty
            pretty_entry = ''
            for char in entry:
                if char == ',':
                    pretty_entry += ',\n' + '    ' * indent_level
                elif char == '(':
                    pretty_entry += '(\n' + '    ' * (indent_level + 1)
                    indent_level += 1
                elif char == ')':
                    indent_level -= 1
                    pretty_entry += '\n' + '    ' * indent_level + ')'
                elif char == ' ':
                    continue  # Skip spaces
                else:
                    pretty_entry += char
            # Strip any trailing spaces from each line
            pretty_entry = '\n'.join(line.rstrip() for line in pretty_entry.split('\n'))
            # Add the entry and comment back together, and add them to the output
            pretty_line = '    ' * indent_level + pretty_entry + (comment if comment else '')
            pretty_data.append(pretty_line)

    # Write the prettified data to the output file
    with open(output_path, 'w') as file:
        file.write('\n'.join(pretty_data))

# Example usage - don't use it on dist files because they don't have any comments.
# prettify_ini('Game.ini', 'Game_pretty.ini')
# prettify_ini('GameUserSettings.ini', 'GameUserSettings_pretty.ini')
