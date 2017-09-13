from os import listdir
from os.path import isfile, join
characters = [str(f[0:-4]) for f in listdir("characters") if isfile(join("characters", f))]
print characters
for c in characters:
	print """<div class='charWrapper'>
			 	<div class='charIcon'>
					<img src='custom/images/characters/""" + c +".png" + """'>
				</div>
				<div class='charName'> """ + c + """
				</div>
			</div>
	"""
