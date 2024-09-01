# Open the file for reading
with open('spacestation.mystl', 'r') as file:
    # Read all lines and strip leading/trailing whitespace
    lines = file.readlines()

# Filter out empty lines and lines that are just whitespace
non_empty_lines = [line for line in lines if line.strip()]

# Write back only non-empty lines to the same file
with open('spacestation2.mystl', 'w') as file:
    file.writelines(non_empty_lines)
