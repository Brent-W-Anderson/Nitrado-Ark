import os
import re

def minify_ini(input_path, output_path):
    with open(input_path, 'r') as file:
        data = file.read().splitlines()

    condensed_data = []
    open_parentheses_count = 0
    condensed_line = ''
    for line in data:
        stripped_line = line.strip()

        # If the line is empty or a comment, add it to the condensed data (if empty) and continue
        if stripped_line == '' or stripped_line.startswith((';', '#')):
            if stripped_line == '':
                condensed_data.append(line)
            continue

        # Remove inline comments
        stripped_line = re.sub(r'\s*;.*$', '', stripped_line)

        # Check if the line contains parentheses
        if '(' in stripped_line or ')' in stripped_line:
            # Remove line breaks within parentheses
            stripped_line = stripped_line.replace('\n', '')
            open_parentheses_count += stripped_line.count('(') - stripped_line.count(')')

        # Concatenate the line with the previous condensed line if inside parentheses
        if open_parentheses_count > 0:
            condensed_line += stripped_line
        else:
            condensed_line += stripped_line

        # Check if the parentheses are closed
        if open_parentheses_count == 0:
            condensed_data.append(condensed_line)
            condensed_line = ''

    # Create the directory if it doesn't exist
    output_dir = os.path.dirname(output_path)
    os.makedirs(output_dir, exist_ok=True)

    # Write the condensed data to the output file
    with open(output_path, 'w') as file:
        file.write('\n'.join(condensed_data))

# Example usage
minify_ini('Game_pretty.ini', 'dist/Game.ini')
minify_ini('GameUserSettings_pretty.ini', 'dist/GameUserSettings.ini')
