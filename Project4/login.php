<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
</head>
<body>
    <form action="login.php" method="POST">
        Username <input name="usr" type="text"><br>
        <br>Password <input name="pwd" type="text"><br>
        <input type="submit" value="Login">
    </form>
    <?php
        session_start();
        error_reporting(E_ALL);
        ini_set('display_errors','On');
        if(!empty($_POST['usr']) && !empty($_POST['pwd'])){
            $userName = $_POST['usr'];
            $password = $_POST['pwd'];
            try {
            $dbh = new PDO("mysql:host=127.0.0.1:3306;dbname=board","root","",array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
            $stmt = $dbh->prepare('select password from users where username=?');
            $stmt->execute([$userName]);
            if($row = $stmt->fetch()){
                if(md5($password) == $row['password']){
                    $_SESSION['user'] = $userName;
                    header('Location: board.php');
                }
            }
            } catch (PDOException $e) {
            print "Error!: " . $e->getMessage() . "<br/>";
            die();
            }
        }
        else{
            if(isset($_POST['usr']) || isset($_POST['pwd']))
                echo "Enter credentials";
        }
    ?>
</body>
</html>