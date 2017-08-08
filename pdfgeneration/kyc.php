<?php
require_once("../config.php");

function email_attach($dati){
  require_once('../library/class.phpmailer.php');
  error_log('dati mail '.print_r($dati,1).PHP_EOL);

  $mail             = new PHPMailer(); // defaults to using php "mail()"
  $mail->CharSet = 'UTF-8';
  //$body             = file_get_contents();
  $body="In Allegato modulo PDF di cui si è richiesta la stampa per il cliente ".$dati['fullname'] .".";
  $body             = eregi_replace("[\]",'',$body);

  $mail->AddReplyTo("app@amlapp.euriskoformazione.it","AMLAPP");

  $mail->SetFrom('app@amlapp.euriskoformazione.it', 'AMLAPP');


  //$address = "app@amlapp.euriskformazione.it";
  foreach( $dati['mailto'] as $mailto)
   {
     $mail->AddAddress($mailto, $mailto);
   }

  $mail->Subject    = 'Oggetto: Modulo di Adeguata Verifica per CPU ' . $dati['CPU'];
  $mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test

  $mail->MsgHTML($body);

  $mail->AddAttachment($dati['file']);      // attachment
  //$mail->AddAttachment("images/phpmailer_mini.gif"); // attachment

  if(!$mail->Send()) {
    echo "Mailer Error: " . $mail->ErrorInfo;
    error_log('mail NON inviata'.print_r($mail,1). error_get_last().PHP_EOL);
  } else {
    echo "Message sent!";
    error_log('mail inviata'.$mailto.$subject.PHP_EOL);
  }
/*
   //$filename = 'myfile';
   $path = '.';
   //$file = $path . "/" . 'kyc'.$contract['contract_id'].'-'.$contract['agency_id'].'.pdf';
   $file=$dati['file'];
   $mailto = $dati['mailto'];//.','. $agent['email'];
   $subject = 'Oggetto: Modulo di Adeguata Verifica per CPU ' . $dati['CPU'];
   $message = 'In Allegato modulo PDF di cui si è richiesta la stampa per il cliente '.$dati['fullname'];

   $content = file_get_contents($file);
   $content = chunk_split(base64_encode($content));

   // a random hash will be necessary to send mixed content
   $separator = md5(time());

   // carriage return type (RFC)
   $eol = "\r\n";

   // main header (multipart mandatory)
   $headers = "From: AMLAPP <amlapp@amlapp.euriskoformazione.it>" . $eol;
   $headers .= "MIME-Version: 1.0" . $eol;
   $headers .= "Content-Type: multipart/mixed; boundary=\"" . $separator . "\"" . $eol;
   $headers .= "Content-Transfer-Encoding: 7bit" . $eol;
   $headers .= "This is a MIME encoded message." . $eol;

   // message
   $body = "--" . $separator . $eol;
   $body .= "Content-Type: text/plain; charset=\"UTF-8\"" . $eol;
   $body .= "Content-Transfer-Encoding: 8bit" . $eol;
   $body .= $message . $eol;

   // attachment
   $body .= "--" . $separator . $eol;
   $body .= "Content-Type: application/octet-stream; name=\"" . $filename . "\"" . $eol;
   $body .= "Content-Transfer-Encoding: base64" . $eol;
   $body .= "Content-Disposition: attachment" . $eol;
   $body .= $content . $eol;
   $body .= "--" . $separator . "--";

   //SEND Mail
   if (mail($mailto, $subject, $body, $headers)) {
      error_log('mail inviata'.$mailto.$subject.PHP_EOL);
       echo "mail send ... OK"; // or use booleans here
   } else {
     error_log('mail inviata'.$mailto.$subject.error_get_last().PHP_EOL);
       echo "mail send ... ERROR!";
       print_r( error_get_last() );
   }
*/
}


function numero_lettere($numero)
{
    if (($numero < 0) || ($numero > 999999999))
    {
        return "$numero";
    }

    $milioni = floor($numero / 1000000);  // Milioni
    $numero -= $milioni * 1000000;
    $migliaia = floor($numero / 1000);    // Migliaia
    $numero -= $migliaia * 1000;
    $centinaia = floor($numero / 100);     // Centinaia
    $numero -= $centinaia * 100;
    $decine = floor($numero / 10);       // Decine
    $unita = $numero % 10;               // Unità

    $cifra_lettere = "";

    if ($milioni)
    {
    $tmp = numero_lettere($milioni);
    $cifra_lettere .= ($tmp=='un') ? '' : $tmp;
    $cifra_lettere .= ($milioni == '1') ? "un milione ":" milioni ";
    }

    if ($migliaia)
    {
    $tmp = numero_lettere($migliaia);
    $cifra_lettere .= ($tmp=='uno') ? '' : $tmp;
    $cifra_lettere .= ($migliaia == '1') ? "mille":"mila ";
    }

    if ($centinaia)
    {
    $tmp = numero_lettere($centinaia);
    $cifra_lettere .= ($tmp=='uno') ? '' : $tmp;
    $cifra_lettere .= "cento";
    }

    $array_primi = array("", "uno", "due", "tre", "quattro", "cinque", "sei",
        "sette", "otto", "nove", "dieci", "undici", "dodici", "tredici",
        "quattordici", "quindici", "sedici", "diciassette", "diciotto",
        "diciannove");
    $array_decine = array("", "", " venti", " trenta", " quaranta", " cinquanta", " sessanta",
        " settanta", " ottanta", " novanta");
    $array_decine_tronc = array("", "", " vent", " trent", " quarant", " cinquant", " sessant",
        " settant", " ottant", " novant");


    if ($decine || $unita)
    {

        if ($decine < 2)
        {
            $cifra_lettere .= $array_primi[$decine * 10 + $unita];
        }
        else
        {
            if ($unita == 1 || $unita == 8)
            $cifra_lettere .= $array_decine_tronc[$decine];
            else
            $cifra_lettere .= $array_decine[$decine];

            if ($unita)
            {
                    $cifra_lettere .= $array_primi[$unita];
            }
        }
    }


    if (empty($cifra_lettere))
    {
        $cifra_lettere = "zero";
    }

    return $cifra_lettere;
}


function mycrop($src, array $rect)
{
    $dest = imagecreatetruecolor($rect['width'], $rect['height']);
    imagesavealpha($dest, true);
    $trans_colour = imagecolorallocatealpha($dest, 0, 0, 0, 127);
    imagefill($dest, 0, 0, $trans_colour);
    imagecopy(
        $dest,
        $src,
        0,
        0,
        $rect['x'],
        $rect['y'],
        $rect['width'],
        $rect['height']
    );

    return $dest;
}

if(isset($_GET['id'])){

  if(isset($_GET['cid'])){
    $id = $_GET['id'];
    $cid = $_GET['cid'];
    $pgurlId = "http://".$_SERVER['HTTP_HOST']."/amlapp/pdfgeneration/viewpdf.php?cid=$cid&id=$id";
  }else{
    $id = $_GET['id'];
    $pgurlId = "http://".$_SERVER['HTTP_HOST']."/amlapp/pdfgeneration/viewpdf.php?id=$id";
  }


}
else{
  $pgurlId = "http://".$_SERVER['HTTP_HOST']."/amlapp/pdfgeneration/scheda2.html";
  //$pgurlId = "http://".$_SERVER['HTTP_HOST']."/amlapp/pdfgeneration/1.html";
  //$pgurlId = "http://".$_SERVER['HTTP_HOST']."/amlapp/pdfgeneration/viewpdf.php";

}
// die($pgurlId)  ;



//require_once('../../_coach/tcpdf/config/lang/eng.php');
//require_once('TCPDF6/config/lang/eng.php');

//require_once('../../_coach/tcpdf/tcpdf.php');
if (strlen($_GET['id'])==0){
  $_GET['id']=89;
}
$sql="SELECT * from kyc where contract_id='".$_GET['id']."'";
$kyc = $db->getRow($sql);
$company=json_decode($kyc['company_data'],true);
$other=json_decode($kyc['owner_data'],true);
$contractor=json_decode($kyc['contractor_data'],true);
$contract=json_decode($kyc['contract_data'],true);

//echo $sql;
//error_log("kyc:".print_r($kyc,1).PHP_EOL);
//error_log("contractor:".print_r($contractor,1).PHP_EOL);
//error_log("other:".print_r($other,1).PHP_EOL);
//error_log("company".print_r($company,1).PHP_EOL);
error_log("contract".print_r($contract,1).PHP_EOL);
$countryList = $db->getRows("SELECT * FROM countries ORDER BY country_name ASC");
//error_log("country".print_r($countrylist,1).PHP_EOL);
$cl=array();
foreach ($countryList as $countryVal) {

  $cl[$countryVal['country_id']]=$countryVal['country_name'];

}
$agent = $db->getRow("SELECT * FROM users  where user_id=". $contract['agent_id']);
//error_log("agent".print_r($agent,1).PHP_EOL);
$agent_settings=json_decode($agent['settings'],true);
error_log("agent settings".print_r($agent_settings,1).PHP_EOL);

//error_log("agent".print_r($agent,1).PHP_EOL);
$agency= $db->getRow("SELECT u.* FROM users u join agency a on a.user_id=u.user_id where a.agency_id=". $contract['agency_id']);
//error_log("agency".print_r($agency,1).PHP_EOL);
////error_log("country".print_r($cl,1).PHP_EOL);

//die();

require_once('TCPDF6/tcpdf.php');
class MYPDF extends TCPDF {
  var $htmlHeader;

      public function setHtmlHeader($htmlHeader) {
          $this->htmlHeader = $htmlHeader;
      }
  //Page header
  public function Header($company) {
    // Logo
    //$image_file = K_PATH_IMAGES.'logo_example.jpg';
    //$this->Image($image_file, 10, 10, 15, '', 'JPG', '', 'T', false, 300, '', false, false, 0, false, false, false);
    // Set font
    $this->SetFont('helvetica', 'B', 7);
    $this->SetTextColor(255,0,0);
    // Title
    //error_log("company".$this->htmlHeader.PHP_EOL);
    $this->Cell(0, 1, $this->htmlHeader, 0, false, 'R', 0, '', 0, false, 'F', 'M');
  }

  // Page footer
  public function Footer($txt) {
    // Position at 15 mm from bottom
    $this->SetY(-10);
    // Set font
    $this->SetFont('times', 'I', 7);
    // Page number

    $this->Cell(0, 10, 'Pagina '.$this->getAliasNumPage().'/'.$this->getAliasNbPages(), 0, false, 'R', 0, '', 0, false, 'T', 'M');
  }

  public function MultiRow($left, $right,$border_left=1,$border_right=1,$righe=0) {
    // MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0)

    $page_start = $this->getPage();
    $y_start = $this->GetY();

    // write the left cell
// writeHTMLCell($w, $h, $x, $y, $html='', $border=0, $ln=0, $fill=0, $reseth=true, $align='', $autopadding=true)
    $this->writeHTMLCell(80, 3, 10, '', html_entity_decode(($left)), $border_left, 0, 1, true, 'R', true);
    $this->writeHTMLCell(100, 3, '', '', html_entity_decode(($right)), $border_right, 0, 1, true, 'L', true);
    $this->LN(3*$righe);
    $this->LN(12);

    //$this->MultiCell(70, 0, $left, $border_left, 'R', 1, 2, 0, '', true, 0);
/*
    $page_end_1 = $this->getPage();
    $y_end_1 = $this->GetY();

    $this->setPage($page_start);

    // write the right cell
    $this->MultiCell(0, 0, $right, $border_right, 'L', 0, 1, $this->GetX() ,$y_start, true, 0);

    $page_end_2 = $this->getPage();
    $y_end_2 = $this->GetY();

    // set the new row position by case
    if (max($page_end_1,$page_end_2) == $page_start) {
      $ynew = max($y_end_1, $y_end_2);
    } elseif ($page_end_1 == $page_end_2) {
      $ynew = max($y_end_1, $y_end_2);
    } elseif ($page_end_1 > $page_end_2) {
      $ynew = $y_end_1;
    } else {
      $ynew = $y_end_2;
    }

    $this->setPage(max($page_end_1,$page_end_2));
    $this->SetXY($this->GetX(),$ynew);
*/
  }


}

$pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);


$pdf->SetTitle('Amlapp - Print Kyc     ');
//error_log($agency['name'].PHP_EOL);
$pdf->SetDisplayMode('fullpage');
$pdf->SetFont('times', '', 10);
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE, PDF_HEADER_STRING);
$pdf->setHtmlHeader($agency['name']);

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP-15, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(1);
$pdf->setPrintHeader(true);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM-20);
$pdf->AddPage('P', 'A4');
// set cell padding
$pdf->setCellPaddings(3, 3, 3, 3);

// set cell margins
$pdf->setCellMargins(1, 1, 1, 1);

// set color for background
$pdf->SetFillColor(255, 255, 127);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $pgurlId);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$html = curl_exec($ch);
curl_close($ch);
/* $js = <<<EOD
{
alert('welcome);
}
EOD;
$pdf->IncludeJS($js); */
//header('Content-Disposition: attachment; filename="downloaded.pdf"');
//header('Content-Disposition: attachment; filename=document-name.pdf');
//$pdf->writeHTML($html, true, false, true, false, '');

//Firma
if (strlen($contractor['sign'])>0 && $agent_settings['sign']==1){
  $contractor['sign']=substr($contractor['sign'],22);
  $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $contractor['sign']));
  $imgdata = base64_decode($contractor['sign']);
  $file = 'signature.png';
  file_put_contents($file, $data);
  $im = imagecreatefrompng($file);
  $black = imagecolorallocate($im, 255, 255, 255);
  $size = intval(min(imagesx($im), imagesy($im)));
  $middle=intval($size/2)+200;
  $im2 = mycrop($im, ['x' => $middle+100, 'y' => 0, 'width' => $size+400, 'height' => $size]);
  if ($im2 !== FALSE) {
      imagecolortransparent($im2, $black);
      imagealphablending($im2, false);
      imagepng($im2, $file);
  }
  $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
  $sign='<img height="120" src="'.$file.'" />';
}
if (strlen($agent['sign'])>0 && $agent_settings['sign']==1){
  $agent['sign']=substr($agent['sign'],22);
  $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $agent['sign']));
  $imgdata = base64_decode($agent['sign']);
  $file = 'agent_signature.png';
  file_put_contents($file, $data);
  $im = imagecreatefrompng($file);
  $black = imagecolorallocate($im, 255, 255, 255);
  $size = intval(min(imagesx($im), imagesy($im)));
  $middle=intval($size/2)+200;
  $im2 = mycrop($im, ['x' => $middle+100, 'y' => 0, 'width' => $size+400, 'height' => $size]);
  if ($im2 !== FALSE) {
      imagecolortransparent($im2, $black);
      imagealphablending($im2, false);
      imagepng($im2, $file);
  }
  $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
  $agent_sign='<img height="120" src="'.$file.'" />';
}
else {
  $agent_sign='';
}

$pdf->SetFillColor(255, 255, 255);
$pdf->writeHTMLCell(80,80, 118, 215, $sign, 0, 0, 1, true, 'L', true);
error_log("signature".$agent_settings['sign']. $sign.$agent_sign. PHP_EOL);
$pdf->writeHTMLCell(80,80, 118, 225, $agent_sign, 0, 0, 1, true, 'L', true);

$pdf->SetFont('times', '', 13);
$pdf->SetFillColor(180, 180, 180);
$pdf->SetY(10);
$pdf->SetX(5);
$txt="Scheda Cliente per persona fisica";
if ($contract['act_for_other']==2){
  $txt="Scheda Cliente per delegato di persone fisiche";
}
if ($contract['act_for_other']==1){
  $txt="Scheda Cliente per Persona Giuridica";
}
$txt.="<sup>1</sup>";
$pdf->writeHTMLCell(195, 1, 5, '', html_entity_decode(strtoupper($txt)), 0, 0, 1, true, 'C', true);

$pdf->SetFillColor(255, 255, 255);

$y = $pdf->getY()+20;
$pdf->SetFont('times', '', 10);


$txt="<p style='line-height:1px'>Codice Progressivo Univoco</p>
<p>(CPU):  N.<b>".$contract['CPU']." </b> del <b>".date('d/m/Y',strtotime($contract['contract_date']) )."</p>";
// writeHTMLCell($w, $h, $x, $y, $html='', $border=0, $ln=0, $fill=0, $reseth=true, $align='', $autopadding=true)
//Cell($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=0, $link='', $stretch=0, $ignore_min_height=false, $calign='T', $valign='M')
$pdf->writeHTMLCell(75, 4, '', $y, $txt, 1, 0, 1, true, 'J', true);
// MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0)

//$this->MultiCell(60, 0, $text,1, 'R', 1, 2, 0, '', true, 0);

$txt="<p>Luogo di identificazione:<b>".$kyc['place_of_identification']."</b></p>
<p>Data di identificazione:<b>".date('d/m/Y',strtotime($kyc['date_of_identification']))."</b></p>";
$x = $pdf->getX();
$pdf->writeHTMLCell(105,2, $x, '', $txt, 0, 0, 1, true, 'R', true);

$style = array('width' => 0.2, 'color' => array(180,180,180));
$pdf->SetLineStyle($style);

$y=$pdf->getY()+30;
$pdf->SetY($y);

//$pdf->writeHTMLCell(180, 4, '', $y, $txt, 0, 0, 1, true, 'L', true);
$pdf->MultiRow("Nome", $contractor['name'],0,1);
$pdf->MultiRow("Cognome", $contractor['surname'],0,1);
$pdf->MultiRow("Data e Luogo di nascita", date('d/m/Y',strtotime($contractor['dob']))." a: " .$contractor['birth_town'] ." - " .ucfirst($contractor['birth_country']) ,0,1);
$pdf->MultiRow("Residenza Anagrafica",$contractor['address_resi']." - ". $contractor['town_resi'] ."<br/>".ucfirst($contractor['resi_country']),0,1,2);
if ($contractor_data['check_residence'])
$txt="Domicilio e residenza coincidono";
else
$txt=$contractor['address_domi']." - ". $contractor['town_domi'] ."<br/>".ucfirst($contractor['domi_country']);



$pdf->MultiRow("Domicilio<br/> <i>Se diverso da Residenza</i>", $txt,0,1,2);
$txt="";
if (strlen($contractor['tel'])>0)
$txt.=" - Tel:".$contractor['tel'];
if (strlen($contractor['mobile'])>0)
$txt.=" - Mobile:".$contractor['mobile'];


$pdf->MultiRow("Recapiti Telefonici", $txt,0,1);
$txt=$contractor['profession'] . " - " . ucfirst($contractor['main_activity_country']);
$pdf->MultiRow("Tipo di Professione e zona geografica nella quale si svolge prevalentemente", $txt,0,1,2);
$txt=$contractor['id_type'] . " - N." .$contractor['id_number'].
"<br/>Rilasciata il:". date('d/m/Y',strtotime($contractor['id_release_date'])) . " - Validità:". date('d/m/Y',strtotime($contractor['id_validity'])).
"<br/>Rilasciata da: ". $contractor['id_authority_name'];
$pdf->MultiRow("Tipologia ed estremi del documento di riconoscimento", $txt,0,1,3);

$txt="per se stesso";
switch ($contractor['act_for_other']){
  case 0:
  $txt="<b>per se stesso</b>";
  break;
  case 1:
  $txt=strtoupper("<b>per conto di una persona giuridica</b><br/>");
  $txt.="in qualità di <b>" .strtoupper($contractor['role_for_other'])."</b>";
  break;
  case 2:
  $txt=strtoupper("<b>per contro di altre persone fisiche</b><br/>");
  $txt.="in qualità di <b>" .strtoupper($contractor['role_for_other'])."</b>";
  break;
}
$pdf->MultiRow("Dichiara di Agire ", ($txt),0,1,2);
$pdf->MultiRow("Note Eventuali", "",0,1);


$y = $pdf->getY()+5;
$style = array('width' => 0.2, 'color' => array(62,62,62));
$pdf->SetLineStyle($style);
$pdf->Ln(15);
$y = $pdf->getY();
// MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0)
$pdf->MultiCell(70,1,"Firma Cliente o di chi lo rappresenta:", 10, 'R', 0, '', 40, $y, true, 0);
$pdf->Line(120, $y+8, 190, $y+8, $style);
$pdf->MultiCell(70,1,"Firma del professionista o del collaboratore:", 10, 'R', 0, '', 40, $y+12, true, 0);
$pdf->Line(120, $y+20, 190, $y+20, $style);
/*
// MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0)
$pdf->MultiCell(70,1,"Firma Cliente o di chi lo rappresenta:", 10, 'R', 0, '', 0, $y, true, 0);
$pdf->Line(70, $y+8, 140, $y+8, $style);
$pdf->MultiCell(70,1,"Firma del professionista o del collaboratore:", 10, 'R', 0, '', 0, $y+12, true, 0);
$pdf->Line(70, $y+20, 140, $y+20, $style);
*/
//$pdf->Image($file);
//$pdf->Image("FB.jpg");

$pdf->SetFont('times', '', 8);
$pdf->SetY(-35);
$y=$pdf->getY();
$style = array('width' => 0.2, 'color' => array(180,180,180));
$pdf->Line(4, $y, 44, $y, $style);

$txt="<p><sup>1</sup>Ai sensi dell’art.22, comma 2 della Legge n. 92/2008 “La clientela ha l’obbligo di fornire sotto la propria personale responsabilità in forma scritta,tutti i dati e le informazioni necessari e aggiornati per consentire ai soggetti designati di adempiere agli obblighi previsti dalla legge. Ai sensi dell’art. 54 della Legge n. 92/2008 “ 1. Salvo che il fatto costituisca più grave reato è punito con la prigionia o con la multa a giorni di  secondo grado chiunque omette di indicare le generalità del soggetto per conto del quale esegue l’operazione o le indica false, omette di indicare il titolare effettivo o lo indica falso. 2. La stessa pena prevista dal comma precedente si applica a chiunque non fornisce informazioni sullo scopo e  sulla natura del rapporto continuativo o dell’operazione occasionale ai sensi dell’art. 61 comma 4 delle legge n. 92/2008 “Salvo quanto previsto dall’articolo 54, la violazione degli obblighi di fornire informazioni necessarie per consentire l’adempimento degli   obblighi di adeguata verifica della clientela è punita con la sanzione amministrativa pecuniaria da 5.000,00 a 80.000,00 euro</p>";
//$pdf->MultiCell(200, 0, $txt,0, 'J', 1, 2, 0, '', true, 0);
$pdf->writeHTMLCell(200, 4, 5, '', html_entity_decode($txt), 0, 0, 1, true, 'J', true);


if ($contractor['act_for_other']<>0){
  $pdf->AddPage('P', 'A4');
//Image($file, $x='', $y='', $w=0, $h=0, $type='', $link='', $align='', $resize=false, $dpi=300, $palign='', $ismask=false, $imgmask=false, $border=0, $fitbox=false, $hidden=false, $fitonpage=false)
//  $pdf->Image($file, 45, 164, 937, 150, '', '', '', true, 300, '', false, false, 0, false, false, true);
  $pdf->writeHTMLCell(80,80, 118, 181, $sign, 0, 0, 1, true, 'L', true);
  $pdf->writeHTMLCell(80,80, 118, 191, $agent_sign, 0, 0, 1, true, 'L', true);

  $pdf->SetFont('times', '', 11);
  $pdf->SetFillColor(180, 180, 180);
  $pdf->SetY(10);
  $pdf->SetX(5);
  $txt=strtoupper("Dati identificativi dei Titolari Effettivi")."<sup>2</sup>";
  // writeHTMLCell($w, $h, $x, $y, $html='', $border=0, $ln=0, $fill=0, $reseth=true, $align='', $autopadding=true)
  $pdf->writeHTMLCell(195, 1, 5, '', html_entity_decode($txt), 0, 0, 1, true, 'C', true);


  //$pdf->MultiCell(190,1,$txt, 0, 'C', 80, '', '', '', true, 0);
  $pdf->SetFillColor(255, 255, 255);
  $pdf->SetFont('times', '', 10);
  $pdf->Ln(20);
  $txt= "<b>".$contract['role_for_other'] ."</b>";
  $pdf->MultiRow("Il Sottoscritto dichiara che agisce in qualità di:", $txt,0,1);
  //$txt="Il Sottoscritto dichiara di agire per conto di  " . $contract['own'];
  if ($contract['act_for_other']==1){
    $txt= "<b>" . strtoupper($contract['owner']) ."</b>";
    $pdf->MultiRow("della Persona Giuridica: ", $txt,0,1);
    $txt="con i seguenti n.".count($other)." titolari effettivi: ";
    if (count($other)==1) $txt="con il seguente titolare effettivo: ";
    $pdf->Ln(0);
    $pdf->writeHTMLCell(190, 1, 10, '', html_entity_decode(strtoupper("</b>".$txt."</b>")), 0, 0, 1, true, 'J', true);

  }

  if($contractor['act_for_other']==2){
      $txt="per i seguenti n.".count($other)." titolari effettivi: ";
      if (count($other)==1) $txt="per il seguente titolare effettivo: ";
      $pdf->Ln(0);

      $pdf->writeHTMLCell(190, 1, 10, '', html_entity_decode($txt), 0, 0, 1, true, 'J', true);
  }
  $i=0;
  foreach ($other as $oth){
    if ($i>0){
      $pdf->AddPage('P', 'A4');
      $pdf->writeHTMLCell(80,80, 118, 181, $sign, 0, 0, 1, true, 'L', true);
      $pdf->writeHTMLCell(80,80, 118, 191, $agent_sign, 0, 0, 1, true, 'L', true);
      $pdf->SetFont('times', '', 11);
      $pdf->SetFillColor(180, 180, 180);
      $pdf->SetY(10);
      $pdf->SetX(5);
      $txt=strtoupper("Dati identificativi del Titolari Effettivo ")."N.".($i+1)."<sup>2</sup>";
      $pdf->writeHTMLCell(190, 1, '', '', html_entity_decode($txt), 0, 0, 1, true, 'C', true);
      $pdf->SetFillColor(255, 255, 255);
      $pdf->SetFont('times', '', 10);
      $pdf->Ln(13);
      //$pdf->MultiCell(190,1,$txt, 0, 'C', 80, '', '', '', true, 0);
//      $pdf->Image($file, 45, 164, 937, 150, '', '', '', true, 300, '', false, false, 0, false, false, true);

    }
    $pdf->SetFillColor(255, 255, 255);
    $pdf->SetFont('times', '', 10);

    $pdf->Ln(10);
    $pdf->MultiRow("Nome", $other[$i]['name'],0,1);
    $pdf->MultiRow("Cognome", $other[$i]['surname'],0,1);
    $pdf->MultiRow("Data e Luogo di nascita", date('d/m/Y',strtotime($other[$i]['dob']))." a: " .$other[$i]['birth_town'] ." - " .ucfirst($other[$i]['birth_country']) ,0,1);
    $pdf->MultiRow("Residenza Anagrafica",$other[$i]['address_resi']." - ". $other[$i]['town_resi'] ."<br/>".ucfirst($other[$i]['resi_country']),0,1,2);
    if ($contractor_data['check_residence'])
    $txt="Domicilio e residenza coincidono";
    else
    $txt=$other[$i]['address_domi']." - ". $other[$i]['town_domi'] ."<br/>".ucfirst($other[$i]['domi_country']);



    $pdf->MultiRow("Domicilio<br/><i> Se diverso da Residenza</i>", $txt,0,1,2);
    $txt="";
    if (strlen($other[$i]['tel'])>0)
    $txt.=" - Tel:".$other[$i]['tel'];
    if (strlen($other[$i]['mobile'])>0)
    $txt.=" - Mobile:".$other[$i]['mobile'];


    $pdf->MultiRow("Recapiti Telefonici", $txt,0,1);
    $txt=$other[$i]['profession'] . " - " . ucfirst($other[$i]['main_activity_country']);
    $pdf->MultiRow("Tipo di Professione e zona geografica nella quale si svolge prevalentemente", $txt,0,1,2);
    $txt=$other[$i]['id_type'] . " - N." .$other[$i]['id_number'].
    "<br/>Rilasciata il:". date('d/m/Y',strtotime($other[$i]['id_release_date'])) . " - Validità:". date('d/m/Y',strtotime($other[$i]['id_validity'])).
    "<br/>Rilasciata da: ". $other[$i]['id_authority_name'];
    $pdf->MultiRow("Tipologia ed estremi del documento di riconoscimento", $txt,0,1,3);


    $pdf->MultiRow("Note Eventuali", "",0,1);
    $y = $pdf->getY()+5;
    $style = array('width' => 0.2, 'color' => array(62,62,62));
    $pdf->SetLineStyle($style);
    $pdf->Ln(25);
    $y = $pdf->getY();
    // MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0)
    $pdf->MultiCell(70,1,"Firma Cliente o di chi lo rappresenta:", 10, 'R', 0, '', 40, $y, true, 0);
    $pdf->Line(120, $y+8, 190, $y+8, $style);
    $pdf->MultiCell(70,1,"Firma del professionista o del collaboratore:", 10, 'R', 0, '', 40, $y+12, true, 0);
    $pdf->Line(120, $y+20, 190, $y+20, $style);

    $txt="<p><sup>2</sup>Ai sensi dell’art. 1, comma 1 lettera r) della Legge n.92/2008 e successive modificazioni, integrazioni ed istruzioni applicative (cfr. Istr. AIF n.5/2009, Istr. AIF n. 5/2010, Istr. AIF n. 6/2010 è “titolare effettivo”: (I) la persona fisica che, in ultima istanza, possiede o controlla un cliente, quando questo è una persona giuridica o un ente privo di personalità giuridica; (II) la persona fisica per conto della quale il cliente agisce. In ogni caso, si considera titolare effettivo: 1) la persona fisica o le persone fisiche che, direttamente o indirettamente, sono titolari di più del 25% dei diritti di voto in una società o comunque, per effetto di accordi o in altro modo, sono in grado di esercitare diritti di voto pari a tale percentuale o di avere il controllo sulla direzione della società, purché non si tratti di una società ammessa alla quotazione su un mercato regolamentato sottoposta a obblighi di comunicazione conformi o equivalenti a quelli previsti dalla normativa comunitaria; 2) la persona fisica o le persone fisiche beneficiarie di più del 25% del patrimonio di una fondazione, di un trust o di altri enti con o senza personalità giuridica che amministrino fondi, ovvero, qualora i beneficiari non siano ancora determinati, la persona o le persone fisiche nel cui interesse principale è istituito o agisce l’ente; 3) la persona fisica o le persone fisiche che sono in grado di esercitare un controllo di più del 25% del patrimonio di un ente con o senza personalità giuridica</p>";
    $pdf->SetFont('times', '', 8);
    $pdf->SetY(-45);
    $y=$pdf->getY();
    $style = array('width' => 0.2, 'color' => array(180,180,180));
    $pdf->SetLineStyle($style);
    $pdf->Line(4, $y, 44, $y, $style);
    $pdf->writeHTMLCell(200, 4, 5, '', html_entity_decode($txt), 0, 0, 1, true, 'J', true);

    //$pdf->MultiCell(200, 0, $txt,0, 'J', 1, 2, 0, '', true, 0);
    $i++;
  }
}
  $pdf->AddPage('P', 'A4');
  $pdf->writeHTMLCell(80,80, 118, 185, $sign, 0, 0, 1, true, 'L', true);
  $pdf->writeHTMLCell(80,80, 118, 195, $agent_sign, 0, 0, 1, true, 'L', true);
  $pdf->SetFont('times', '', 11);
  $pdf->SetFillColor(180, 180, 180);
  $pdf->SetY(10);
  $pdf->SetX(5);
  $txt=strtoupper("informazioni sulla operazione");
  $pdf->writeHTMLCell(195, 1, 5, '', html_entity_decode(strtoupper($txt)), 0, 0, 1, true, 'C', true);
//  $pdf->MultiCell(190,1,$txt, 0, 'C', 80, '', '', '', true, 0);
//  $pdf->Image($file, 15, 154, 937, 150, '', '', '', true, 300, '', false, false, 0, false, false, true);

$pdf->Ln(14);

setlocale(LC_MONETARY, 'it_IT');
$txt= money_format('%.2n', $contract['contract_value']) ;
if ($contract['value_det']==0)
  $txt= "NON DETERMINABILE";
$pdf->SetFillColor(255, 255, 255);

//$pdf->MultiRow("Valore economico dell'operazione", $txt,0,1);
$pdf->writeHTMLCell(60, 3, 10, '', html_entity_decode(("Valore economico dell'operazione")), 0, 0, 1, true, 'J', true);

$pdf->writeHTMLCell(120, 3, '', '', html_entity_decode(($txt)), 1, 0, 1, true, 'J', true);

$txt=("L’area geografica in cui si deve svolgere l’operazione (indicare lo Stato)");
$pdf->Ln(12);
$pdf->writeHTMLCell(130, 1, 10, '', html_entity_decode(($txt)), 0, 0, 1, true, 'J', true);
//$pdf->MultiCell(190,1,$txt, 0, 'L', 80, '', '', '', true, 0);

$txt=ucfirst($contract['activity_country']);
$pdf->writeHTMLCell(50, 1, 130, '', html_entity_decode(strtoupper($txt)), 0, 0, 1, true, 'J', true);
//$pdf->MultiCell(190,1,$txt, 0, 'L', 0, '', '', '', true, 0);
$y=$pdf->getY();
$pdf->Line(130, $y+9, 190, $y+9, $style);

$txt="Il sottoscritto dichiara  ";
if ($contractor['check_pep']==1)
$txt.= "di <b>ESSERE</b> “Persona Politicamente Esposta“<sup>3</sup>";
else
$txt.= "di <b>NON ESSERE</b> “Persona Politicamente Esposta“<sup>3</sup>";

$txt.=" ai sensi dell’articolo 1 comma 1 lettera N della Legge 17/06/2008 n° 92 e dell’allegato tecnico della predetta legge.\n ";
$pdf->Ln(8);
$pdf->writeHTMLCell(180, 3, 10, '', html_entity_decode(($txt)), 0, 0, 1, true, 'J', true);
//$pdf->MultiCell(180,3,$txt, 0, 'L', 0, '', '', '', true, 0);

$txt="Il sottoscritto inoltre dichiara  ";

if($contract['act_for_other']){
  $pep=false;
  $npep=0;
  foreach ($other as $key => $value) {
      if ($value['check_pep']==1)
        $pep=true;
        $npep++;
  }
  if ($pep) {
    if ($npep>1)
    $txt.= 'che un  Titolare Effettivo <b style="color:#7b0d1a">RISULTA ESSERE</b> “Persona Politicamente Esposta“<sup>3</sup>';
    else
    $txt.='che ' . numero_lettere($npep). ' Titolari Effettivi <b>RISULTANO ESSERE</b> “Persone Politicamente Esposte“<sup>3</sup>';

  }
  else{
    $txt.= ' tra i titolari effettivi <b style="color:#1c224b">NON RISULTANO ESSERE</b> “Persone Politicamente Esposte“<sup>3</sup>';

  }
}
else{
  if ($contractor['check_pep']==1)
  $txt.= "di <b>ESSERE</b> “Persona Politicamente Esposta“<sup>3</sup>";
  else
  $txt.= "di NON ESSERE “Persona Politicamente Esposta<sup>3</sup>“";
}
$txt.=" ai sensi dell’articolo 1 comma 1 lettera N della Legge 17/06/2008 n° 92 e dell’allegato tecnico della predetta legge.\n ";
$pdf->Ln(14);
$pdf->writeHTMLCell(180, 3, 10, '', html_entity_decode(($txt)), 0, 0, 1, true, 'J', true);

//$pdf->MultiCell(180,3,$txt, 0, 'J', 0, '', '', '', true, 0);
$pdf->Ln(20);
$txt="Il sottoscritto dichiara, inoltre,";
$pdf->writeHTMLCell(180, 3, 10, '', html_entity_decode(($txt)), 0, 0, 1, true, 'J', true);
//$pdf->MultiCell(180,2,$txt, 0, 'L', 80, '', '', '', true, 0);
$pdf->Ln(8);
$txt="1) che la natura dell’operazione per la quale si richiede la prestazione è:";
$pdf->writeHTMLCell(130, 3, 10, '', html_entity_decode(($txt)), 0, 0, 1, true, 'J', true);
//$pdf->MultiCell(180,2,$txt, 0, 'L', 80, '', '', '', true, 0);
$txt=strtoupper($contract['nature_contract']);
//$pdf->Ln(8);
$pdf->writeHTMLCell(60, 3, 130, '', html_entity_decode(($txt)), 0, 0, 1, true, 'J', true);
//$pdf->MultiCell(190,1,$txt, 0, 'L', 0, '', '', '', true, 0);
$y=$pdf->getY();
$pdf->Line(130, $y+10, 190, $y+10, $style);
$pdf->Ln(10);
$txt="2) che lo scopo dell’operazione è:";
//$pdf->MultiCell(180,1,$txt, 0, 'L', 80, '', '', '', true, 0);
$pdf->writeHTMLCell(130, 3, 10, '', html_entity_decode(($txt)), 0, 0, 1, true, 'J', true);
$txt=strtoupper($contract['scope_contract']);
//$pdf->Ln(8);
//$pdf->MultiCell(190,1,$txt, 0, 'L', 0, '', '', '', true, 0);
$pdf->writeHTMLCell(60, 3, 130, '', html_entity_decode(($txt)), 0, 0, 1, true, 'J', true);
$y=$pdf->getY();
$pdf->Line(130, $y+10, 190, $y+10, $style);
$pdf->Ln(10);
$txt="3) ai sensi della vigente normativa antiriciclaggio, sotto la propria personale responsabilità, la veridicità dei dati, delle informazioni fornite e delle dichiarazioni rilasciate e in particolare di quanto dichiarato in relazione alle persone fisiche per conto delle quali, eventualmente, opera, impegnandosi altresì ad informarVi di eventuali variazioni che dovessero interessare i dati di cui sopra (cfr. Nota n.1 sugli obblighi di comunicazione della clientela ed apparato sanzionatorio ex art. 22, comma 2 , art. 54 ed art.61 comma 4 della Legge n. 92/2008).\n";
//$pdf->MultiCell(180,4,$txt, 0, 'J', 80, '', '', '', true, 0);
$pdf->writeHTMLCell(180, 3, 10, '', html_entity_decode(($txt)), 0, 0, 1, true, 'J', true);
$txt="4) di confermare che i fondi e le risorse economiche eventualmente utilizzati per lo svolgimento dell’operazione sono compatibili con il reddito e la situazione patrimoniale del Cliente";
$pdf->Ln(30);
$pdf->writeHTMLCell(180, 3, 10, '', html_entity_decode(($txt)), 0, 0, 1, true, 'J', true);
$txt='5) di essere stato informato della circostanza che il mancato rilascio in tutto o in parte delle informazioni di cui sopra può pregiudicare la capacità della Società di dare esecuzione alla prestazione richiesta e si impegna a comunicare senza ritardo ogni eventuale integrazione o variazione che si dovesse verificare in relazione ai dati forniti con la presente dichiarazione;';
$pdf->Ln(10);
$pdf->writeHTMLCell(180, 3, 10, '', html_entity_decode(($txt)), 0, 0, 1, true, 'J', true);

$txt='6) di prestare il consenso al trattamento dei dati personali riportati nella presente dichiarazione e di quelli che saranno eventualmente in futuro forniti ad integrazione e/o modifica degli stessi. Il sottoscritto prende altresì atto che la comunicazione a terzi dei dati personali sarà effettuata dal professionista esclusivamente in adempimento degli obblighi di legge.';
$pdf->Ln(20);
$pdf->writeHTMLCell(180, 3, 10, '', html_entity_decode(($txt)), 0, 0, 1, true, 'J', true);

$style = array('width' => 0.2, 'color' => array(62,62,62));
$pdf->SetLineStyle($style);
$pdf->Ln(25);
$txt='Data: '. date('d/m/Y');

$pdf->writeHTMLCell(180, 3, 10, '', html_entity_decode(($txt)), 0, 0, 1, true, 'J', true);
$pdf->Ln(10);
$y = $pdf->getY();
// MultiCell($w, $h, $txt, $border=0, $align='J', $fill=0, $ln=1, $x='', $y='', $reseth=true, $stretch=0)
$pdf->MultiCell(70,1,"Firma Cliente o di chi lo rappresenta:", 10, 'R', 0, '', 40, $y, true, 0);
$pdf->Line(120, $y+8, 190, $y+8, $style);
$pdf->MultiCell(80,1,"Firma del professionista o del collaboratore:", 10, 'R', 0, '', 40, $y+12, true, 0);
$pdf->Line(120, $y+20, 190, $y+20, $style);
$pdf->SetFont('times', '', 9);
$pdf->MultiCell(140,1,"La presente scheda è stata compilata e sottoscritta dal cliente alla presenza di:", 0, 'R', 0, '', -20, $y+22, true, 0);
$pdf->Line(120, $y+30, 190, $y+30, $style);


$txt="<sup>3</sup> Ai sensi dell’art. 1, comma 1 lettera n) della Legge 92/2008 e successive modificazioni ed integrazioni è “n) “persona politicamente esposta”: la persona fisica, individuata sulla base dei criteri di cui all'allegato tecnico alla presente legge, che occupa o ha occupato, a San Marino o all’estero, importanti cariche pubbliche”. Ai sensi dell’Allegato Tecnico alla Legge 17 giugno 2008 n. 92 Art. 1 1. Per “persona politicamente esposta” si intende la persona fisica, che occupa o ha occupato, a San Marino o all’estero, importanti cariche pubbliche, comprese quelle di seguito indicate, anche se diversamente denominate: 1) capo di Stato, capo di Governo, ministro, vice ministro, sottosegretario, parlamentare, alto funzionario di partito politico o politico di alto livello. 2) membro di organi giudiziari le cui decisioni non sono generalmente soggette ad ulteriore impugnazione, 3) membro di consiglio di amministrazione di banche centrali o di autorità di vigilanza, 4) ambasciatore, incaricato d’affari, ufficiale di alto livello delle forze armate, 5) membro di organi di amministrazione, direzione o vigilanza di imprese possedute dallo Stato, 6) membro di direzione, di consiglio
di amministrazione o avente equivalente posizione apicale in un'organizzazione internazionale; 2. Devono essere trattate come persone politicamente esposte le seguenti persone: a) i familiari diretti delle persone indicate al comma precedente o coloro con i quali tali persone intrattengono notoriamente stretti legami, inclusi i seguenti soggetti: 1) il coniuge o il partner considerato equivalente al coniuge, 2) i figli e i loro coniugi, 3) i genitori; b) la persona fisica che notoriamente abbia  con una persona di cui al precedente comma 1 la titolarità effettiva di società o entità giuridiche; c) la persona fisica che sia unico titolare effettivo di società o entità giuridiche o istituti giuridici notoriamente creati di fatto a beneficio di una delle persone di cui al precedente comma 1. 3. La cessazione della carica non esonera i soggetti designati dall’adempiere, in funzione del rischio, gli obblighi rafforzati di adeguata verifica della clientela.”. 4. Non rientrano nella definizione di cui al comma 1 del presente articolo le persone fisiche che ricoprono le precedenti cariche a livello inferiore a quelli di vertice.”";
$pdf->SetFont('times', '', 8);
$pdf->SetY(-60);
$y=$pdf->getY();
$style = array('width' => 0.2, 'color' => array(180,180,180));
$pdf->SetLineStyle($style);
$pdf->Line(4, $y, 44, $y, $style);
$pdf->writeHTMLCell(200, 4, 5, '', html_entity_decode($txt), 0, 0, 1, true, 'J', true);
//ob_clean();
ob_start();
$pdf->Output();
$file=ob_get_contents();
$fn='kyc'.$contract['id'].'-'.$contract['agency_id'].'.pdf';
if ($_REQUEST['download']=="Y"){
  header('Content-type: '.mime_content_type_ax($fn));
  header('Content-Disposition: attachment; filename='.$fn);

}
echo $file;
file_put_contents($fn,$file);
error_log("nome file".$fn.PHP_EOL);
$dati=array('mailto'=>array($contractor['email'],$agent['email']),'CPU'=>$contract['CPU'],'fullname'=>$contractor['fullname'],
'file'=>$fn);
if ($agent_settings['sendKycRisk']==1)
  email_attach($dati);

?>
