<?php
require_once("../config.php");
function email_attach($dati){
  require_once('../library/class.phpmailer.php');

  $mail             = new PHPMailer(); // defaults to using php "mail()"
  $mail->CharSet = 'UTF-8';
  //$body             = file_get_contents();
  $body="In Allegato modulo PDF di cui si è richiesta la stampa per il cliente ".$dati['fullname'] .".";
  $body             = eregi_replace("[\]",'',$body);

  $mail->AddReplyTo("amlapp@euriskoformazione.it","AMLAPP");

  $mail->SetFrom('amlapp@euriskoformazione.it', 'AMLAPP');


  //$address = "app@amlapp.euriskformazione.it";
  $mail->AddAddress($dati['mailto'], "AMLAPP");

  $mail->Subject    = 'Oggetto: Modulo di Valutazione del rischio per il  CPU ' . $dati['CPU'];
  $mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test

  $mail->MsgHTML($body);

  $mail->AddAttachment($dati['file']);      // attachment
  //$mail->AddAttachment("images/phpmailer_mini.gif"); // attachment

  if(!$mail->Send()) {
    echo "Mailer Error: " . $mail->ErrorInfo;
    error_log('mail NON inviata'.print_r($mail,1). error_get_last().PHP_EOL);
  } else {
    echo "Message sent!";
    error_log('mail inviata'.print_r($dati,1).$mailto.$subject.PHP_EOL);
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
if (strlen($_GET['id']==0)){
  $_GET['id']="89";
}
if (strlen($_GET['id']>0)){
  $sql="SELECT * from kyc where contract_id='".$_GET['id']."'";

}
$kyc = $db->getRow($sql);
$company=json_decode($kyc['company_data'],true);
$other=json_decode($kyc['owner_data'],true);
$contractor=json_decode($kyc['contractor_data'],true);
$contract=json_decode($kyc['contract_data'],true);
//echo $sql;
//error_log("kyc:".print_r($kyc,1).PHP_EOL);
error_log("contractor:".print_r($contractor,1).PHP_EOL);
error_log("contract:".print_r($contract,1).PHP_EOL);
//error_log("other:".print_r($other,1).PHP_EOL);
//error_log("company".print_r($company,1).PHP_EOL);
$countryList = $db->getRows("SELECT * FROM countries ORDER BY country_name ASC");
//error_log("country".print_r($countrylist,1).PHP_EOL);
$cl=array();
foreach ($countryList as $countryVal) {

  $cl[$countryVal['country_id']]=$countryVal['country_name'];

}
$agent = $db->getRow("SELECT * FROM users  where user_id=". $contract['agent_id']);
//error_log("agent".print_r($agent,1).PHP_EOL);
$agent_settings=json_decode($agent['settings'],true);
error_log("agent".print_r($agent,1).PHP_EOL);
error_log("agent settings".print_r($agent_settings,1).PHP_EOL);

$agency= $db->getRow("SELECT u.* FROM users u join agency a on a.user_id=u.user_id where a.agency_id=". $contract['agency_id']);
//error_log("agency".print_r($agency,1).PHP_EOL);
////error_log("country".print_r($cl,1).PHP_EOL);
$sql="SELECT * from risk where contract_id='".$_GET['id']."'";
$risk = $db->getRow($sql);
$rd=json_decode($risk['risk_data'],true);
error_log("risk".print_r($risk,1).PHP_EOL);
error_log("risk_data".print_r($rd,1).PHP_EOL);

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

//Firma Cliente
if (strlen($contracto['sign']>0 && $agent_settings['sign']==1)){
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
  $pdf->SetFillColor(255, 255, 255);
  $pdf->writeHTMLCell(80,80, 118, 205, $sign, 0, 0, 1, true, 'L', true);
}
$pdf->SetFont('times', '', 13);
$pdf->SetFillColor(180, 180, 180);
$pdf->SetY(10);
$pdf->SetX(5);
$txt="Valutazione del Rischio";
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
$txt="<p>svolta a :<b>".$kyc['place_of_identification']."</b></p>
<p>il :<b>".date('d/m/Y',strtotime($kyc['date_of_identification']))."</b></p>";
$x = $pdf->getX();
$pdf->writeHTMLCell(105,2, $x, '', $txt, 0, 0, 1, true, 'R', true);

$style = array('width' => 0.2, 'color' => array(180,180,180));
$pdf->SetLineStyle($style);

$y=$pdf->getY()+30;
$pdf->SetY($y);

//$this->MultiCell(60, 0, $text,1, 'R', 1, 2, 0, '', true, 0);
$txt=" svolta per il cliente: ";
$own=$contractor['name'] ." " . $contractor['surname'];
if ($contract['act_for_other']==1){
  $own=$company['name'];
}
if ($contract['act_for_other']==2){
  $own=$owner[0]['name'] ." " . $owner[0]['surname'];;
}
$pdf->MultiRow($txt,  $own,0,1);
$txt=" Identificazione svolta da: ";
$own=$agent['name'] ." " . $agent['surname'];
//error_log($contract['owner'].$contract['act_for_other']);
$pdf->MultiRow($txt,  $own,0,1);

if ($agent_settings['risk_type']==1){
  // vecchia valutazione del cliente
  $pdf->SetFont('times', '', 11);
  $pdf->SetFillColor(180, 180, 180);
  $pdf->Ln(4);
  $txt="Profilo soggettivo del Cliente";
  $pdf->writeHTMLCell(180, 1, '', '', html_entity_decode(strtoupper($txt)), 0, 0, 1, true, 'C', true);
  $pdf->Ln(13);

  $pdf->SetFillColor(255, 255, 255);
  $pdf->SetFont('times', '', 10);
  $txt="Natura Giuridica:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['oldRiskSm']['natgiu']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="natgiu" id="natgiu-1" value="1" readonly="true" '.$alto.' /> RPS';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="natgiu" id="natgiu-0" value="1" readonly="true" '.$basso.' /> RPI';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //una riga
  $pdf->Ln(10);
  $txt="Prevalente Attività Svolta:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['oldRiskSm']['mainact']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="mainact-1" value="1" readonly="true" '.$alto.' /> RPS';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="mainact-0" value="1" readonly="true" '.$basso.' /> RPI';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  //una riga
  $pdf->Ln(10);
  $txt="Comportamento del Cliente:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['oldRiskSm']['beahvior']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="beahvior" id="beahvior-1" value="1" readonly="true" '.$alto.' /> RPS';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="beahvior" id="beahvior-0" value="1" readonly="true" '.$basso.' /> RPI';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  //una riga
  $pdf->Ln(10);
  $txt="Comportamento del Cliente:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['oldRiskSm']['beahvior']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="beahvior" id="beahvior-1" value="1" readonly="true" '.$alto.' /> RPS <br/>poco o troppo collaborativo';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="beahvior" id="beahvior-0" value="1" readonly="true" '.$basso.' /> RPI <br/>collaborativo';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga

  $pdf->SetFont('times', '', 11);
  $pdf->SetFillColor(180, 180, 180);
  $pdf->Ln(23);
  $txt="Profilo Oggettivo del Cliente";
  $pdf->writeHTMLCell(180, 1, '', '', html_entity_decode(strtoupper($txt)), 0, 0, 1, true, 'C', true);
  $pdf->Ln(13);

  $pdf->SetFillColor(255, 255, 255);
  $pdf->SetFont('times', '', 10);
  //una riga
  $pdf->Ln(10);
  $txt="Tipologia e Concreta Modalità di esecuzione:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['oldRiskSm']['tip_ese']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="beahvior" id="beahvior-1" value="1" readonly="true" '.$alto.' /> RPS';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="beahvior" id="beahvior-0" value="1" readonly="true" '.$basso.' /> RPI';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  //una riga
  $pdf->Ln(10);
  $txt="Ammontare e la frequenza del Rapporto:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['oldRiskSm']['amm_freq']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="amm_freq" id="amm_freq-1" value="1" readonly="true" '.$alto.' /> RPS';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="amm_freq" id="amm_freq-0" value="1" readonly="true" '.$basso.' /> RPI';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  //una riga
  $pdf->Ln(10);
  $txt="Coerenza della Operazione in relazione alle informazioni assunte:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['oldRiskSm']['coerenza']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="coerenza" id="coerenza-1" value="1" readonly="true" '.$alto.' /> RPS';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="coerenza" id="coerenza-0" value="1" readonly="true" '.$basso.' /> RPI';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  //una riga
  $pdf->Ln(10);
  $txt="Area Geografica della operazione:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['oldRiskSm']['country']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="country" id="country-1" value="1" readonly="true" '.$alto.' /> RPS';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="country" id="country-0" value="1" readonly="true" '.$basso.' /> RPI';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  $pdf->AddPage('P', 'A4');

}
else {
  // nuova Valutazione
  $pdf->SetFont('times', '', 11);
  $pdf->SetFillColor(180, 180, 180);
  $pdf->Ln(4);
  $txt="Profilo soggettivo del Cliente";
  $pdf->writeHTMLCell(180, 1, '', '', html_entity_decode(strtoupper($txt)), 0, 0, 1, true, 'C', true);
  $pdf->Ln(13);

  $pdf->SetFillColor(255, 255, 255);
  $pdf->SetFont('times', '', 10);
  $txt="il Cliente è PEP:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['subjectiveProfile']['pep']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //una riga
  $pdf->Ln(10);
  $txt="il Cliente ha precedenti penali:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['subjectiveProfile']['criminalprecedings']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //una riga
  $pdf->Ln(10);
  $txt="il Cliente è presente in liste:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['subjectiveProfile']['presenceinlist']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $pdf->Ln(10);
  $txt="<b>" .$rd['partial']['subjectiveProfile']. "</b>";
  $pdf->MultiRow("Rischio Parziale Profilo Soggettivo:", $txt,0,1);

  $pdf->SetFont('times', '', 11);
  $pdf->SetFillColor(180, 180, 180);
  $pdf->Ln(13);
  $txt="Residenza";
  $pdf->writeHTMLCell(180, 1, '', '', html_entity_decode(strtoupper($txt)), 0, 0, 1, true, 'C', true);
  $pdf->Ln(13);

  $pdf->SetFillColor(255, 255, 255);
  $pdf->SetFont('times', '', 10);
  $txt="il Cliente risiede in Paesi a Rischio:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['Residence']['riskCountry']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //una riga
  $pdf->Ln(10);
  $txt="il Cliente svolge la principale attività in paesi a rischio:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['Residence']['activityInRiskCountry']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  $pdf->Ln(10);
  $txt="<b>" .$rd['partial']['Residence']. "</b>";
  $pdf->MultiRow("Rischio Parziale Residenza:", $txt,0,1);



  //una riga

  $pdf->SetFont('times', '', 11);
  $pdf->SetFillColor(180, 180, 180);
  $pdf->Ln(13);
  $txt="Attivita'";
  $pdf->writeHTMLCell(180, 1, '', '', html_entity_decode(strtoupper($txt)), 0, 0, 1, true, 'C', true);
  $pdf->Ln(13);

  $pdf->SetFillColor(255, 255, 255);
  $pdf->SetFont('times', '', 10);
  //-->
  $txt="Il Cliente possiede le competenze per svolgere l'attività principale:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['mainActivity']['skills']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //una riga
  $pdf->Ln(10);
  $txt="Attività principale con alto volume finanziario:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['mainActivity']['highFinancialMovment']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  //una riga
  $pdf->Ln(10);
  $txt="Attività principale finanziata con fondi pubblici:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['mainActivity']['pubblicSectorFinancing']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  //una riga
  $pdf->Ln(10);
  $txt="Attività principale finanziata con fondi europei:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['mainActivity']['EUFinancing']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  //una riga
  $pdf->Ln(10);
  $txt="Attività principale con alto uso di contante:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['mainActivity']['cash']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  $pdf->Ln(10);
  $txt="<b>" .$rd['partial']['mainActivity']. "</b>";
  $pdf->MultiRow("Rischio Parziale Attività:", $txt,0,1);

  $pdf->AddPage('P', 'A4');

  //sezione
  $pdf->SetFont('times', '', 11);
  $pdf->SetFillColor(180, 180, 180);
  $pdf->Ln(13);
  $txt="Comportamento del Cliente";
  $pdf->writeHTMLCell(180, 1, '', '', html_entity_decode(strtoupper($txt)), 0, 0, 1, true, 'C', true);
  $pdf->Ln(13);
  $pdf->SetFillColor(255, 255, 255);
  //una riga
  $pdf->Ln(10);
  $txt="Il Cliente è collaborativo:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['behavior']['collaborative']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  //una riga
  $pdf->Ln(10);
  $txt="Il Cliente è troppo collaborativo:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['behavior']['tooMuchCollaborative']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  //una riga
  $pdf->Ln(10);
  $txt="Il Cliente non è collaborativo per nulla:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['behavior']['atAllCollaborative']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine rigA
  $pdf->Ln(10);
  $txt="<b>" .$rd['partial']['behavior']. "</b>";
  $pdf->MultiRow("Rischio Parziale comportamento del cliente:", $txt,0,1);
  //fine sezione
  //sezione
  $pdf->SetFont('times', '', 11);
  $pdf->SetFillColor(180, 180, 180);
  $pdf->Ln(13);
  $txt="Frequenza";
  $pdf->writeHTMLCell(180, 1, '', '', html_entity_decode(strtoupper($txt)), 0, 0, 1, true, 'C', true);
  $pdf->Ln(13);
  $pdf->SetFillColor(255, 255, 255);
  //una riga
  $pdf->Ln(10);
  $txt="Attività ad Alta frequenza:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['frequency']['highFrequency']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  //una riga
  $pdf->Ln(10);
  $txt="Frequenza e durata Consistente con il profilo economico del Cliente:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['frequency']['consistent']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  $pdf->Ln(20);
  $txt="<b>" .$rd['partial']['frequency']. "</b>";
  $pdf->MultiRow("Rischio Parziale Frequenza:", $txt,0,1);
  //sezione
  $pdf->SetFont('times', '', 11);
  $pdf->SetFillColor(180, 180, 180);
  $pdf->Ln(13);
  $txt="Consistenza";
  $pdf->writeHTMLCell(180, 1, '', '', html_entity_decode(strtoupper($txt)), 0, 0, 1, true, 'C', true);
  $pdf->Ln(13);
  $pdf->SetFillColor(255, 255, 255);
  //una riga
  $pdf->Ln(10);
  $txt="Continuità di relazione consistente con il profilo economico del cliente:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['Consistency']['relation']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  //una riga
  $pdf->Ln(10);
  $txt="Dimensione del giro di affari consistente con il profilo patrimoniale del Cliente:";
  $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
  if($rd['Consistency']['dimension']==1){
    $alto='checked="checked"';
    $basso='';
  }else{
    $basso='checked="checked"';
    $alto='';
  }
  $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
  $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
  //fine riga
  $pdf->Ln(20);
  $txt="<b>" .$rd['partial']['Consistency']. "</b>";
  $pdf->MultiRow("Rischio Parziale Frequenza:", $txt,0,1);
  // fine sezione
  $pdf->AddPage('P', 'A4');
  if ($contract['act_for_other']==1){
    //sezione
    $pdf->SetFont('times', '', 11);
    $pdf->SetFillColor(180, 180, 180);
    $pdf->Ln(13);
    $txt="Profilo dell Società";
    $pdf->writeHTMLCell(180, 1, '', '', html_entity_decode(strtoupper($txt)), 0, 0, 1, true, 'C', true);
    $pdf->Ln(13);
    $pdf->SetFillColor(255, 255, 255);
    //una riga
    $pdf->Ln(10);
    $txt="Struttura Societaria non chiara e comprensibile:";
    $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
    if($rd['Company']['ownership_compreensive']==1){
      $alto='checked="checked"';
      $basso='';
    }else{
      $basso='checked="checked"';
      $alto='';
    }
    $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
    $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
    $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
    $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
    //fine riga
    //una riga
    $pdf->Ln(10);
    $txt="Struttura Partecipativa Complessa:";
    $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
    if($rd['Company']['ownership_link']==1){
      $alto='checked="checked"';
      $basso='';
    }else{
      $basso='checked="checked"';
      $alto='';
    }
    $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
    $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
    $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
    $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
    //fine riga
    //una riga
    $pdf->Ln(10);
    $txt="Connessioni con Paesi a Rischio:";
    $pdf->writeHTMLCell(80, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'R', true);
    if($rd['Company']['ownership_country']==1){
      $alto='checked="checked"';
      $basso='';
    }else{
      $basso='checked="checked"';
      $alto='';
    }
    $txt='<input type="radio" name="pep" id="pep-1" value="1" readonly="true" '.$alto.' /> Alto';
    $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
    $txt='<input type="radio" name="pep" id="pep-0" value="1" readonly="true" '.$basso.' /> Basso';
    $pdf->writeHTMLCell(35, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
    //fine riga
    //fine riga
    $pdf->Ln(20);
    $txt="<b>" .$rd['partial']['Company']. "</b>";
    $pdf->MultiRow("Rischio Parziale Profilo Società:", $txt,0,1);
    // fine sezione
  }
  //settings
}
$pdf->SetFont('times', '', 11);
$pdf->SetFillColor(180, 180, 180);
$pdf->Ln(13);
$txt="Esito della Valutazione";
$pdf->writeHTMLCell(180, 1, '', '', html_entity_decode(strtoupper($txt)), 0, 0, 1, true, 'C', true);
$pdf->Ln(13);
$pdf->SetFillColor(255, 255, 255);
$pdf->Ln(10);
$txt="<b>" .$rd['riskCalculated']. "</b>";
$pdf->MultiRow("Rischio Calcolato:", $txt,0,1);
$pdf->Ln(10);
$txt="<b>" .$rd['riskAssigned']. "</b>";
$pdf->MultiRow("Rischio Calcolato:", $txt,0,1);
$pdf->Ln(10);
$txt="<b>" .$rd['riskDescription']. "</b>";
$pdf->MultiRow("Processo Valutativo:", $txt,0,1);
$pdf->Ln(10);
$txt="<b>" .$rd['notes']. "</b>";
$pdf->MultiRow("Note Eventuali:", $txt,0,1);

$pdf->Ln(10);
$txt='Data: '. date('d/m/Y');
$pdf->writeHTMLCell(180, 3, 10, '', html_entity_decode(($txt)), 0, 0, 1, true, 'J', true);
$pdf->Ln(10);

$txt="Firma del RPI:";
$pdf->writeHTMLCell(120, 1, '', '', html_entity_decode(($txt)), 0, 0, 1, true, 'C', true);
$y=$pdf->getY();
$pdf->Line(120, $y+8, 190, $y+8, $style);


//ob_clean();
ob_start();
$pdf->Output();
$file=ob_get_contents();
$fn='kyc'.$contract['contract_id'].'-'.$contract['agency_id'].'.pdf';
if ($_REQUEST['download']=="Y"){
  header('Content-type: '.mime_content_type_ax($fn));
  header('Content-Disposition: attachment; filename='.$fn);
}

echo $file;
file_put_contents($fn,$file);
$dati=array('mailto'=>$agent['email'],'CPU'=>$contract['CPU'],'fullname'=>$contractor['fullname'],
'file'=>$fn);
if ($agent_settings['sendKycRisk']==1)
  email_attach($dati);

?>
