import json
from flask import Flask, request, redirect, g, render_template
import requests
from urllib.parse import quote

# Authentication Steps, paramaters, and responses are defined at https://developer.spotify.com/web-api/authorization-guide/
# Visit this url to see all the steps, parameters, and expected response.


app = Flask(__name__ , static_url_path='', static_folder='web/static', template_folder='web/templates')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
#  Client Keys
CLIENT_ID = "f3c35eb4b7e546a89fb498cebda2956a"
CLIENT_SECRET = "458d29a4b5b149b3815733e29511ef61"

# Spotify URLS
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE_URL = "https://api.spotify.com"
API_VERSION = "v1"
SPOTIFY_API_URL = "{}/{}".format(SPOTIFY_API_BASE_URL, API_VERSION)

# Server-side Parameters
CLIENT_SIDE_URL = "http://localhost"
PORT = 8080
REDIRECT_URI = "{}:{}/callback/q".format(CLIENT_SIDE_URL, PORT)
SCOPE = "playlist-modify-public playlist-modify-private user-library-read user-top-read"
STATE = ""
SHOW_DIALOG_bool = True
SHOW_DIALOG_str = str(SHOW_DIALOG_bool).lower()

total_art_limit = 50

auth_query_parameters = {
    "response_type": "code",
    "redirect_uri": REDIRECT_URI,
    "scope": SCOPE,
    # "state": STATE,
    # "show_dialog": SHOW_DIALOG_str,
    "client_id": CLIENT_ID
}


@app.route("/")
def index():
	# Auth Step 1: Authorization
	url_args = "&".join(["{}={}".format(key, quote(val)) for key, val in auth_query_parameters.items()])
	auth_url = "{}/?{}".format(SPOTIFY_AUTH_URL, url_args)
	return redirect(auth_url)


@app.route("/callback/q")
def callback():
	# Auth Step 4: Requests refresh and access tokens
	auth_token = request.args['code']
	code_payload = {
		"grant_type": "authorization_code",
		"code": str(auth_token),
		"redirect_uri": REDIRECT_URI,
		'client_id': CLIENT_ID,
		'client_secret': CLIENT_SECRET,
	}
	post_request = requests.post(SPOTIFY_TOKEN_URL, data=code_payload)

	# Auth Step 5: Tokens are Returned to Application
	response_data = json.loads(post_request.text)
	access_token = response_data["access_token"]
	refresh_token = response_data["refresh_token"]
	token_type = response_data["token_type"]
	expires_in = response_data["expires_in"]

	# Auth Step 6: Use the access token to access Spotify API
	authorization_header = {"Authorization": "Bearer {}".format(access_token)}

	# Get profile data
	user_profile_api_endpoint = "{}/me".format(SPOTIFY_API_URL)
	profile_response = requests.get(user_profile_api_endpoint, headers=authorization_header)
	profile_data = json.loads(profile_response.text)

	#grab the entire persons libary

	tmp = []
	off = 0
	while off < total_art_limit:
		user_libary_api_endpoint = "{}/me/tracks?market=ES&limit=50&offset={}".format(SPOTIFY_API_URL , off)
		libary_re = requests.get(user_libary_api_endpoint , headers=authorization_header )
		libary_json = json.loads(libary_re.text)
		
		if len(libary_json["items"]) == 0:
			break
		tmp = tmp + libary_json["items"]
		#print(libary_json)
		off += 50
	
	tart = []
	artists = set()
	tracks = []
	for track in tmp:
		tracks.append(track["track"])
		tart.append(track["track"]["album"]["artists"][0]["id"])
		for art in track["track"]["artists"]:
			artists.add((art["uri"] ,art["name"]))
		
	
	def get_albums(album , head):
		album_api = "{}/albums/{}".format(SPOTIFY_API_URL , album)
		album_info = requests.get(album_api , headers=head)
		return json.loads(album_info.text)
	
	def get_related(artist,head):
		related_api = "{}/artists/{}/related-artists".format(SPOTIFY_API_URL , artist)
		related_art = requests.get(related_api , headers=head)
		return json.loads(related_art.text)
	def get_artists(artist , head):
		art = "{}/artists/{}".format(SPOTIFY_API_URL , artist)
		arts = requests.get(art , headers=head)
		return json.loads(arts.text)
	def get_top_art(term , head):
		tops = "{}/me/top/artists?time_range={}&limit=50".format(SPOTIFY_API_URL,term)
		topj = requests.get(tops , headers=head)
		return json.loads(topj.text)
	def get_top_tracks(term , head):
		tops = "{}/me/top/tracks?time_range={}&limit=50".format(SPOTIFY_API_URL,term)
		topj = requests.get(tops , headers=head)
		return json.loads(topj.text)
	
	related = [ get_related(art.split(":")[-1] , authorization_header) for art,x in artists]
	arts = [get_artists(a,authorization_header) for a in tart]
	
	topart = {}
	
	topart["long"] = get_top_art("long_term" , authorization_header)
	topart["med"] = get_top_art("medium_term" , authorization_header)
	topart["short"] = get_top_art("short_term" , authorization_header)

	toptrack = {}
	
	toptrack["long"] = get_top_tracks("long_term" , authorization_header)
	toptrack["med"] = get_top_tracks("medium_term" , authorization_header)
	toptrack["short"] = get_top_tracks("short_term" , authorization_header)	
	

	#album = [get_albums(al , authorization_header) for al in albums]
	
	a = {}
	t = {}
	g = {}
	
	# Combine profile and playlist data to display
	
	d = [] 
	for art , rel in zip(artists , related):
		red = [ a["name"] for a in rel["artists"]]
		uri , name = art
		d.append({name: red})
	a["art"] = d
	t["tracks"] = tmp
	g["genre"] = arts
	
	related = json.dumps(a)
	
	
	
	return render_template("index.html", sorted_array=related , tracks=json.dumps(t) , album=json.dumps(g) , topA=json.dumps(topart) , topT = json.dumps(toptrack) )


if __name__ == "__main__":
    app.run(debug=True, port=PORT)