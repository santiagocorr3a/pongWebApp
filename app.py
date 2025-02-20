from flask import Flask, flash, redirect, render_template, request, session, abort, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from cs50 import SQL
import datetime
import random


app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
db = SQL("sqlite:///pong.db")

def generate_unique_game_code():
    game_code = f"{random.randint(1000, 9999)}-{random.randint(1000, 9999)}"
    gameCodeCheck = db.execute("SELECT id FROM games WHERE game_code = ?", game_code)
    if gameCodeCheck:
        return generate_unique_game_code()
    return game_code

@app.route('/')
def index():
    if "user_id" in session:
        temp = db.execute("SELECT username FROM users WHERE id = ?", session["user_id"])
        name = temp[0]['username']
        return render_template("index.html", name = name)
    else:
        return render_template("index.html")

@app.route("/play", methods=["GET", "POST"])
def play():
    return render_template("play.html")
@app.route("/help")
def help():
    return render_template("help.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    session.clear()
    if request.method == 'GET':
        return render_template("login.html")
    if request.method == 'POST':
        username = request.form.get("username")
        password = request.form.get("password")
        db_password = db.execute("SELECT * FROM users WHERE username = ?", username)
        if len(db_password) != 1 or not check_password_hash(
            db_password[0]["hash"], password):
            return redirect("/error")
        else:
            session["user_id"] = db_password[0]["id"]
            return redirect("/")

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == 'GET':
        return render_template("signup.html")
    if request.method == 'POST':
        username = request.form.get("signup_username")
        password = request.form.get("signup_password")
        first_name = request.form.get("first_name")
        last_name = request.form.get("last_name")
        if not username or not password or not first_name or not last_name:
            return redirect("/error")
        elif " " in username or " " in password or " " in first_name or " " in last_name:
            return redirect("/error")
        elif not any(i in '!@#$%^&*(),.?":}{|<>' for i in password):
            return redirect("/error")
        elif not any(i in '0123456789' for i in password):
            return redirect("/error")
        elif not any(i in 'ABCDEFGHIJKLMNOPQRSTUVXYZ' for i in password):
            return redirect("/error")
        elif not any(i in 'abcdefghijklmnopqrstuvwxyz' for i in password):
            return redirect("/error")
        else:
            db.execute("INSERT INTO users (username, hash, first_name, last_name) VALUES (?,?,?,?)", username, generate_password_hash(password), first_name, last_name)
            return redirect("/login")
@app.route("/error")
def error():
    return render_template("error.html")

@app.route("/history")
def history():
    return render_template("history.html")

@app.route("/game", methods=["GET", "POST"])
def game():
    if request.method == 'GET':
        return render_template("error.html")
    if request.method == 'POST':
        number_players = int(request.form.get("player_count"))
        game_code = generate_unique_game_code()
        db.execute("INSERT INTO games(game_code, date) VALUES (?,?)", game_code, datetime.datetime.now().date())
        game_id = db.execute("SELECT id FROM games WHERE game_code = ?", game_code)[0]['id']
        for i in range(number_players):
            player_name = f"Player {i + 1}"
            db.execute("INSERT INTO scores(game_id, points, player_name) VALUES (?,?,?)", game_id, 0, player_name)
        if "user_id" in session:
            host_id = db.execute("SELECT id FROM users WHERE id = ?", session["user_id"])[0]['id']
            db.execute("UPDATE games SET host_id = ? WHERE id = ?", host_id, game_id)
            host_name = db.execute("SELECT first_name FROM users WHERE id = ?",session["user_id"])[0]['first_name']
            db.execute("UPDATE scores SET player_name = ? WHERE game_id = ? AND player_name = 'Player 1'", host_name, game_id)
        #players = db.execute("SELECT id, points, player_name FROM scores WHERE game_id = ?", game_id)
        #game_url = f"{request.host_url}join/{game_code}"
        return redirect(f"/game/{game_code}")
        #return render_template("game.html", number_players = number_players, game_code = game_code, players = players, game_url = game_url)

@app.route("/game/<game_code>", methods=["GET", "POST"])
def game_lobby(game_code):
    game = db.execute("SELECT * FROM games WHERE game_code = ?", game_code)
    if not game:
        return render_template("error.html", message="Game not found.")
    players = db.execute("SELECT id, points, player_name FROM scores WHERE game_id = ?", game[0]['id'])
    return render_template("game.html", game_code=game_code, players=players)


@app.route('/update_score', methods=['POST'])
def update_score():
    data = request.get_json()
    player_id = data['player_id']
    points_to_add = data['points']
    player = db.execute("SELECT * FROM scores WHERE id = ?", player_id)
    if player:
        player[0]['points'] += points_to_add
        db.execute("UPDATE scores SET points = ? WHERE id = ?", player[0]['points'], player_id)
        return jsonify({"new_score": player[0]['points']})
    else:
        return render_template("error.html")

@app.route('/update_podium', methods=['POST'])
def update_podium():
    data = request.get_json()
    player_id = data['player_id']
    game_id = (db.execute("SELECT game_id FROM scores WHERE id = ?", player_id))[0]['game_id']
    podium = db.execute("SELECT player_name, points FROM scores WHERE game_id = ? ORDER BY points ASC LIMIT 3", game_id)
    return jsonify({
        "thirdPlace": {"name": podium[2]['player_name'], "points": podium[2]['points']},
        "secondPlace": {"name": podium[1]['player_name'], "points": podium[1]['points']},
        "firstPlace": {"name": podium[0]['player_name'], "points": podium[0]['points']}
    })

@app.route('/change_name', methods=['POST'])
def change_name():
    data = request.get_json()
    new_name = data['new_name']
    player_id = data['player_id']
    db.execute("UPDATE scores SET player_name = ? WHERE id = ?", new_name, player_id)
    print(new_name)
    return jsonify({"new_name": new_name})

@app.route('/add_player', methods=['POST'])
def add_player():
    data = request.get_json()
    player_name = data['player_name']
    player_score = data['player_score']
    game_code = data['game_code']
    game_id = (db.execute("SELECT id FROM games WHERE game_code = ?", game_code)[0]['id'])
    db.execute("INSERT INTO scores(game_id, points, player_name) VALUES (?, ?, ?)", int(game_id), int(player_score), player_name)
    player_id = (db.execute("SELECT id FROM scores WHERE player_name = ? AND game_id = ? AND points = ?;", player_name, int(game_id), int(player_score)))[0]['id']
    return jsonify({"id" : player_id, "player_name" : player_name, "points" : player_score})

@app.route("/test")
def test():
    return render_template("game.html")

@app.route("/join/<game_code>", methods=["GET", "POST"])
def join_lobby(game_code):
    game = db.execute("SELECT * FROM games WHERE game_code = ?", game_code)
    if not game:
        return render_template("error.html", message="Game not found.")
    players = db.execute("SELECT id, points, player_name FROM scores WHERE game_id = ?", game[0]['id'])
    return render_template("player_view.html", game_code=game_code, players=players)

@app.route('/join_game', methods=['POST'])
def join_game_form():
    game_code = request.form.get("game_code")
    print(f"/game/{game_code}")
    return redirect(f"/join/{game_code}")
