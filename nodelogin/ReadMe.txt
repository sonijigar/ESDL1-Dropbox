Password encryption:
https://ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/

Table queries:
database name:
test
tables::
dropbox_users
queries::
1. create table dropbox_users(user_id INT NOT NULL AUTO_INCREMENT,firstname varchar(150), lastname varchar(150), email varchar(250), password varchar(400), PRIMARY KEY (user_id));

2. create table user_group(group_id INT PRIMARY KEY, owner_id INT, permission boolean, user1 int, user2 int, user3 int, user4 int, user5 int, user6 int, user7 int, user8 int, user9 int, user10 int, FOREIGN KEY (owner_id) REFERENCES dropbox_users(user_id));

3. create table dir_table(dir_id INT PRIMARY KEY, owner_id INT, group_id INT, FOREIGN KEY (owner_id) REFERENCES dropbox_users(user_id), FOREIGN KEY (group_id) REFERENCES user_group(group_id));

4. create table file_table(file_id INT AUTO_INCREMENT PRIMARY KEY, dir_id INT, owner_id INT, name varchar(200), type varchar(50), content LONGBLOB);
