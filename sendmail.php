<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    require 'phpmailer/src/Exception.php';
    require 'phpmailer/src/PHPMailer.php';

    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    $mail->setLanguage('ru', 'phpmailer/language/');
    $mail->IsHTML(true);
    
    $mail->setFrom('aidar.test@mail.ru');
    $mail->addAddress('elvira_kafizova@mail.ru');
    $mail->Subject = 'Заявка с тестового сайта';

    $body = '<h1>Письмо с вопросом</h1>';

    if(trim(!empty($_POST['name']))){
        $body.='<p><strong>Имя:</strong>' .$_POST['name'].'</p>'
    }
    if(trim(!empty($_POST['email']))){
        $body.='<p><strong>E-mail:</strong>' .$_POST['email'].'</p>'
    }
    if(trim(!empty($_POST['message']))){
        $body.='<p><strong>Сообщение:</strong>' .$_POST['message'].'</p>'
    }

    $mail->Body = $body;

    if(!$mail->send()) {
        $message = 'Ошибка';
    } else {
        $message = 'Ошибок нет';
    }

    $response = ['message' => $message];

    header('Content-type: application/json');
    echo json_encode($response);

?>
