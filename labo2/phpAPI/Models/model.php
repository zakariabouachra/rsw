<?php
class Model {
    private $ServerUrl; 

    public function __construct($ServerUrl) {
        $this->ServerUrl = $ServerUrl;
    }

    public function sendData($data) {
        $options = array(
            'http' => array(
                'header' => "Content-Type: application/json\r\n",
                'method' => 'POST',
                'content' => $data
            )
        );

        $context = stream_context_create($options);

        $response = file_get_contents($this->ServerUrl, false, $context);

        return $response;
    }
}