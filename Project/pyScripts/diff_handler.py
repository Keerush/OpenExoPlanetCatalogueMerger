import urllib
import os
import xml.etree.ElementTree as ET
import csv
import gzip
import io
import xmltools

url_oec = "https://github.com/OpenExoplanetCatalogue/oec_gzip/raw/master/systems.xml.gz"
url_exoplaneteu = "http://exoplanet.eu/catalog/csv/"
planets_oec = []
planets_exoplaneteu = []

# store planets from oec
oec = ET.parse(gzip.GzipFile(fileobj=io.BytesIO(urllib.urlopen(url_oec).read())))
for planet in oec.findall(".//planet"):
    planets_oec.append(planet.findtext("name"))

# download csv file from exoplanet.eu
xmltools.ensure_empty_dir("tmp_data")
urllib.urlretrieve(url_exoplaneteu, "tmp_data/exoplanet.eu_catalog.csv")

# parse data into array
f = open("tmp_data/exoplanet.eu_catalog.csv")
header = [x.strip() for x in f.readline()[1:].replace("# ", "").split(",")]
reader = csv.reader(f)
for line in reader:
    p = dict(zip(header, line))
    planets_exoplaneteu.append(p["star_name"])

# print the different planets
s = set(planets_exoplaneteu)
diff = [x for x in planets_oec if x not in s]
print diff