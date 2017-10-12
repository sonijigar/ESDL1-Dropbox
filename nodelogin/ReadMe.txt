Password encryption:
https://ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/

Table queries:
database name:
test


tables::
dropbox_users
user_group
dir_table
file_table
avtivity_history
star

queries::
1. create table dropbox_users(user_id INT NOT NULL AUTO_INCREMENT,firstname varchar(150), lastname varchar(150), email varchar(250), password varchar(400), salt varchar(100), PRIMARY KEY (user_id));

2. create table user_group(group_id varchar(200), owner_id INT, permission int(1),name varchar(50), FOREIGN KEY (owner_id) REFERENCES dropbox_users(user_id));

3. create table dir_table(dir_id INT PRIMARY KEY AUTO_INCREMENT, owner_id INT, group_id varchar(200), parent_id INT, FOREIGN KEY (owner_id) REFERENCES dropbox_users(user_id), FOREIGN KEY (group_id) REFERENCES user_group(group_id), FOREIGN KEY (parent_id) REFERENCES dir_table(dir_id));

4. create table file_table(file_id INT AUTO_INCREMENT PRIMARY KEY, dir_id INT, owner_id INT, name varchar(200), type varchar(50), content varchar(500), group_id varchar(200), time_stamp timestamp, FOREIGN KEY (dir_id) REFERENCES dir_table(dir_id), FOREIGN KEY (owner_id) REFERENCES dropbox_users(user_id), FOREIGN KEY (group_id) REFERENCES user_group(group_id);

5. create table activity_history(file_id int , name varchar(200), activity int(1), time_stamp timestamp, user_id int,  foreign key (user_id) references dropbox_users(user_id));

6. create table star(user_id int, dir_id int, file_id int, FOREIGN KEY(user_id) REFERENCES dropbox_users(user_id), FOREIGN KEY(dir_id) REFERENCES dir_table(dir_id), FOREIGN KEY(file_id) REFERENCES file_table(file_id));