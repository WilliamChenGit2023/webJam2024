import subprocess
print(subprocess.run(['python', 'detect.py', 'test-img4.png']).returncode)