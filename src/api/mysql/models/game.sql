-- Table pour les joueurs
CREATE TABLE players (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL
);

-- Table principale pour les parties
CREATE TABLE games (
  id INT PRIMARY KEY AUTO_INCREMENT,
  winner INT,
  date DATETIME,
  FOREIGN KEY (winner) REFERENCES players(id) ON DELETE CASCADE
);

-- Table pour les mouvements
CREATE TABLE moves (
  id INT PRIMARY KEY AUTO_INCREMENT,
  game_id INT,
  player_id INT,
  card_row INT NOT NULL,
  card_col INT NOT NULL,
  color VARCHAR(255) NOT NULL,
  number INT NOT NULL,
  round INT NOT NULL,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);
