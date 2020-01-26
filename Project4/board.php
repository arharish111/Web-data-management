<html>
<head><title>Message Board</title></head>
<body>
<form action="board.php" method="POST" id="messageForm">
  <textarea name="inputText"></textarea>
  <input type="submit" name="postBtn" value="New Post"><br>
  <input type="submit" name="logoutBtn" value="Logout">
</form>
<?php
  session_start();
  error_reporting(E_ALL);
  ini_set('display_errors','On');
  if(!isset($_SESSION['user'])){
    header('Location: login.php');
  }
  if(isset($_POST['logoutBtn']) || $_SESSION['user'] == "0"){
    $_SESSION['user'] = "0";
    header('Location: login.php');
  }
  else{
    if(!empty($_POST['inputText']) && (isset($_POST['postBtn']) || isset($_GET['replyto']))){
      $userName = $_SESSION['user'];
      $message = $_POST['inputText'];
      try {
        $dbh = new PDO("mysql:host=127.0.0.1:3306;dbname=board","root","",array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        $stmt = $dbh->prepare('select NOW()');
        $stmt->execute();
        $dateTime = $stmt->fetch()['NOW()'];
        $dbh->beginTransaction();
        $stmt = $dbh->prepare('insert into posts values(?,?,?,?,?)');
        if(isset($_GET['replyto']))
          $stmt->execute([uniqid(),$_GET['replyto'],$userName,$dateTime,$message]);
        else
          $stmt->execute([uniqid(),null,$userName,$dateTime,$message]);
        $dbh->commit();
      } catch (PDOException $e) {
        print "Error!: " . $e->getMessage() . "<br/>";
        die();
      }
    }
    try {
      $dbh = new PDO("mysql:host=127.0.0.1:3306;dbname=board","root","",array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
      $stmt = $dbh->prepare('select * from posts order by datetime desc');
      $stmt->execute();
      while ($row = $stmt->fetch()) {
        $stmt1 = $dbh->prepare('select fullname from users where username=?');
        $stmt1->execute([$row['postedby']]);
        $fName = $stmt1->fetch()['fullname'];
        echo "ID: " . $row['id'] . "\t" . 
         "Posted by: " . $row['postedby'] . "\t" . "Full Name: " . $fName . "\t" . 
         "Date time: " . $row['datetime'] . "\t";
        if(!is_null($row['replyto']))
          echo "Reply to: " . $row['replyto'] . "\t";
        echo "Message: " . $row['message'] . "\t" . 
             "<button type=\"submit\" form=\"messageForm\" formaction=\"board.php?replyto=" . 
             $row['id'] . "\"" .
             ">Reply</button>";
        echo "<br>";
      }
    } catch (PDOException $e) {
      print "Error!: " . $e->getMessage() . "<br/>";
      die();
    }
  }
?>
</body>
</html>