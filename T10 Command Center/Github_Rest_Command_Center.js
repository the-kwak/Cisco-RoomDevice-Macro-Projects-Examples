const xapi = require('xapi');

var captureResponse;

//Event Pitcher
function postRequest(payload) {
  xapi.command('HttpClient Post', devices[device], payload).then((response) => {
    captureResponse = JSON.stringify(response);
    var filterResponse = captureResponse.split(',');
    console.log('Payload sent to '+'"'+devices[device].Url.replace('/putxml', '/')+'"'+' > Command = '+command+' > UserInput Sent = '+userInput+'. Report = '+filterResponse[36].replace('}',''));
  });
}

//creates the paylooad for the postRequest - Author: Magnus Ohm
function sendEvent(message) {
	//Message will need to incorporate more informatation
	
  //var payload = message
  console.log('payload is :' + message)
  /**
	all payloads to be done:
	Zoom
	Teams
	Webex
	
	Completed:
		Dialing - <Command><Dial><Number>"+ PhoneNumber +"</Number></Dial></Command>
		Disconnect - <Command><Call><Disconnect></Disconnect></Call></Command>
		Volume Set - <Command><Audio><Volume><Set><Level>50</Level></Set></Volume></Audio></Command>
		Microphone Mute - <Command><Audio><Microphones><Mute></Mute></Microphones></Audio></Command>
		Microphone Unmute - <Command><Audio><Microphones><Unmute></Unmute></Microphones></Audio></Command>
		Share content - <Command><Presentation><Start><PresentationSource></PresentationSource><SendingMode>LocalRemote</SendingMode></Start></Presentation></Command>
		Stop Content - <Command><Presentation><Stop></Stop></Presentation></Command>
		DTMFSEnd - <Command><Call><DTMFSend><DTMFString>12#</DTMFString></DTMFSend></Call></Command>
  */
  
  // Uncomment below to fully test
  postRequest(message);
}

//default infromation needed for HTTPsPost
const defaults = {'xml': 'Content-Type: text/xml',
                 'auth': 'Authorization: Basic ',
                 'https': 'true'
};

// Stanard basic Auth admin:
const DEFAULT_AUTH = 'YWRtaW46'


//sets classes for individual room devices, for device selction and control.
const devices = {
                  'default':   {'Url': 'https://x.x.x.x/putxml',
                                'Header': [defaults.xml, defaults.auth + 'YWRtaW46'],
                                'AllowInsecureHTTPS': defaults.https},

                  'test':   {'Url': 'https://someip/putxml',
                                'Header': [defaults.xml, defaults.auth + DEFAULT_AUTH],
                                'AllowInsecureHTTPS': defaults.https},
							
				   'mini':   {'Url': 'https://anotherip/putxml',
                                'Header': [defaults.xml, defaults.auth + DEFAULT_AUTH],
                                'AllowInsecureHTTPS': defaults.https},
								
				   'sx10_1':   {'Url': 'https://sx10ip1/putxml',
                                'Header': [defaults.xml, defaults.auth + DEFAULT_AUTH],
                                'AllowInsecureHTTPS': defaults.https},
							
				   'sx10_2':   {'Url': 'https://sx10ip2/putxml',
                                'Header': [defaults.xml, defaults.auth + DEFAULT_AUTH],
                                'AllowInsecureHTTPS': defaults.https},
 };

let device = 'default';

var zoomSipPattern = '@zoomcrc.com';

let command = '<Command></Command>';

let post = command.slice(9);
let pre = command.slice(0,9);
let notification;

let userInput;
let index;

var EVENTURL = 'https://x.x.x.x/putxml';
var HEADERS = ['Content-Type: text/xml', 'Authorization: Basic YWRtaW46MW5maW5pdHlXQHIk'];

xapi.event.on('UserInterface Extensions Widget Action', (event) => {
  if (event.Type == 'released'){
	// Using the pre and post to encapuslate user input into the payload
    let message = pre + userInput + post;
	  // This boolean was used so I can notifiy the users that the volume is changing. Will need to find a better solution for this but right now it works
      if (Boolean(notification)){
        message = message.slice(0,-10)+ notification.slice(0,84) + userInput + notification.slice(84)+ message.slice(-10);
      }
        switch(event.Value||event.WidgetId){
          case 'event1':
            device = 'test';
            console.log('"'+device+'"'+ " selected.");
            break;
          case 'event2':
            device = 'mini';
            console.log('"'+device+'"'+ " selected.");
            break;
          case 'event3':
            device = 'sx10_1'
            console.log('"'+device+'"'+ " selected.");
            break;
          case 'event4':
            device = 'sx10_2'
            console.log('"'+device+'"'+ " selected.");
            break;
          case 'event6':
            //Additional Devices
            console.log('"'+device+'"'+ " selected.");
            break;
          case 'x001':
			// Dialing <Command><Dial><Number>"+ PhoneNumber +"</Number></Dial></Command>
            command = '<Command><Dial><Number></Number></Dial></Command>';
			//The Pre is <Command><Dial><Number> post is </Number></Dial></Command>
			pre = command.slice(0,23);
			post = command.slice(23);
            //console.log('Command Selected = '+ command);
            xapi.command('UserInterface Message TextInput Display', {
                     Title: 'Place Call',
                     Text: 'Enter your SIP/H323 video address<p> If dialling outbound audio, please enter "91" + your 10 digit number.',
                     FeedbackId: 'dial1.0',
                     Placeholder: 'Enter call information here',
                     InputType: 'Numeric',
                     KeyboardState: 'Open',
                     SubmitText: 'Update'
                     });
            break;
          case 'x002':
			
            command = '<Command><Call><Disconnect></Disconnect></Call></Command>';
			pre = command.slice(0,27);
			post = command.slice(27);
			// Change user input to empty just to make sure the API has no issues
			userInput = '';
			// Added the status to input stored to keep with the rest of the task having one
			xapi.command('UserInterface Extensions Widget SetValue', {
	         Value: 'Disconnect Call ',
	         WidgetId: 'commandText_Field'
			});
            //console.log('Command Selected = '+command);
            break;
          case 'x003':
            command = '001';
            console.log('Command Selected = '+command);
           /**
            xapi.command('UserInterface Message TextInput Display', {
                     Title: 'Join Zoom Meeting',
                     Text: 'Enter the Meeting ID and tap Join.<p> Want your own Zoom account? Go to harvard.zoom.us',
                     FeedbackId: 'zoom3.0',
                     Placeholder: 'Meeting ID',
                     InputType: 'Numeric',
                     KeyboardState: 'Open',
                     SubmitText: 'Update'
                     });
            */
             xapi.command('UserInterface Message Alert Display', {
                     Title: 'Zoom dialer is disabled',
                     Text: 'This Zoom dialer is a work in progress and is currently disabled',
                     Duration: '5'
                     });
            break;
          case 'x004':
            command = '<Command><Audio><Volume><Set><Level></Level></Set></Volume></Audio></Command>';
			pre = command.slice(0,36);
			post = command.slice(36);
            notification = "<UserInterface><Message><Alert><Display><Title>Volume Updated </Title><Text> Set to </Text><Duration>3</Duration></Display></Alert></Message></UserInterface>"
            //console.log('Command Selected = '+command);
            xapi.command('UserInterface Message TextInput Display', {
                     Title: 'Set System Volume',
                     Text: 'Set the volume on the video conferencing device to a specified level.',
                     FeedbackId: 'volume1.0',
                     Placeholder: 'Range (0-100)',
                     InputType: 'Numeric',
                     KeyboardState: 'Open',
                     SubmitText: 'Update'
                     });
            break;
		  case 'x005':
            command = '<Command><Audio><Microphones><Mute></Mute></Microphones></Audio></Command>';
			pre = command.slice(0,35);
			post = command.slice(35);
			userInput = '';
			xapi.command('UserInterface Extensions Widget SetValue', {
	         Value: 'Mute Microphones ',
	         WidgetId: 'commandText_Field'
			});
			//console.log('Command Selected = '+command);
            break;
          case 'x006':
            command = '<Command><Audio><Microphones><Unmute></Unmute></Microphones></Audio></Command>';
			pre = command.slice(0,37);
			post = command.slice(37);
			userInput = '';
			xapi.command('UserInterface Extensions Widget SetValue', {
	         Value: 'Unmute Microphones ',
	         WidgetId: 'commandText_Field'
			});
			//console.log('Command Selected = '+command);
            break;
          case 'x007':
            command = '<Command><Presentation><Start><PresentationSource></PresentationSource><SendingMode>LocalRemote</SendingMode></Start></Presentation></Command>';
			pre = command.slice(0,50);
			post = command.slice(50);
			console.log('Command Selected = '+command);
            xapi.command('UserInterface Message Prompt Display', {
                     Title: 'Select Source to Share',
                     Text: 'Select the Coonector ID of the input you\'d like to share<p> Please only choose 1',
                     FeedbackId: 'share1.0',
                     'Option.1': 'Input 1',
                     'Option.2': 'Input 2',
                     'Option.3': 'Input 3',
                     'Option.4': 'Input 4',
                     'Option.5': 'Cancel'
                     });
            break;
          case 'x008':
            command = '<Command><Presentation><Stop></Stop></Presentation></Command>';
			pre = command.slice(0,29);
			post = command.slice(29);
			//console.log('Command Selected = '+command);
			xapi.command('UserInterface Extensions Widget SetValue', {
	                      Value: 'Stop Presentation ',
	                      WidgetId: 'commandText_Field'
			      });
            break;
          case 'x009':
            command = '<Command><Call><DTMFSend><DTMFString></DTMFString></DTMFSend></Call></Command>';
			pre = command.slice(0,37);
			post = command.slice(37);
            console.log('Command Selected = '+command);
            xapi.command('UserInterface Message TextInput Display', {
                     Title: 'Enter DTMF',
                     Text: 'Send DTMF tones to the far end. <p> Please include a "#" at the end of your string.',
                     FeedbackId: 'DTMF1.0',
                     Placeholder: 'Enter Full DTMF String',
                     InputType: 'Numeric',
                     KeyboardState: 'Open',
                     SubmitText: 'Update'
                     });
            break;
          case 'execute':
            sendEvent(message);
      }
  }
});

// Listens to the Users entry from the text feild above, and either appends '@zoomcrc.com' or does nothing depeding on the dial method
xapi.event.on('UserInterface Message TextInput Response', (event) => {
  if (!event.Text.includes('<Command>')){
	switch(event.FeedbackId){
	     case 'zoom3.0':
	       if (event.Text.includes((".")||('@'))) {
            userInput = event.Text;
	          }
	       else {
	         userInput = event.Text+zoomSipPattern;
	       xapi.command('UserInterface Extensions Widget SetValue', {
	         Value: 'Dial: '+ event.Text + zoomSipPattern,
	         WidgetId: 'commandText_Field'
	       });
	       }
	      break;
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
	     case 'dial1.0':
	       userInput = event.Text;
	       xapi.command('UserInterface Extensions Widget SetValue', {
	         Value: 'Dial: '+ event.Text,
	         WidgetId: 'commandText_Field'
	       });
	       break;
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
	     case 'volume1.0':
	       	if(/^[0-9]*$/.test(event.Text)){
	             if (parseFloat(event.Text) <= 100 && parseFloat(event.Text) >= 0){
    	             userInput = event.Text;
    	             xapi.command('UserInterface Extensions Widget SetValue', {
    	               Value: 'Level: '+ event.Text,
    	               WidgetId: 'commandText_Field'
    	               });
	             }
	             else {
	              userInput = null;
	              command = 'null';
	              xapi.command('UserInterface Message Alert Display', {
                    Title: 'Not Supported',
                    Text: 'Please use whole integers between 0-100',
                    Duration: 5});
                xapi.command('UserInterface Extensions Widget SetValue', {
	                  Value: 'Error: Unsupported character entered. Input Cleared.',
	                  WidgetId: 'commandText_Field'});
	       	      }
	       	}
	       	else {
	       	 userInput = null;
	       	 command = 'null';
	         xapi.command('UserInterface Message Alert Display', {
                    Title: 'Not Supported',
                    Text: 'Please use whole integers between 0-100',
                    Duration: 5});
           xapi.command('UserInterface Extensions Widget SetValue', {
	                  Value: 'Error: Unsupported character entered. Input Cleared.',
	                  WidgetId: 'commandText_Field'});
	       	}
	       break;
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
	     case 'DTMF1.0':
	       if(/^[0-9*#]*$/.test(event.Text)){
	       userInput = event.Text;
	       xapi.command('UserInterface Extensions Widget SetValue', {
	         Value: 'DTMF Sequence: '+ event.Text,
	         WidgetId: 'commandText_Field'
	       });
	       }
	       else {
	         userInput = null;
	         command = 'null';
	         xapi.command('UserInterface Message Alert Display', {
                    Title: 'Not Supported',
                    Text: 'Please use "#", "*" and whole integers ',
                    Duration: 5});
           xapi.command('UserInterface Extensions Widget SetValue', {
	                      Value: 'Error: Unsupported character entered. Input Cleared.',
	                      WidgetId: 'commandText_Field'
	       });
	       }
	       break;
    }
}
else {
  userInput = null;
  command = 'null';
  xapi.command('UserInterface Message Alert Display', {
                    Title: 'Error',
                    Text: '":" is not a supported character',
                    Duration: 5});
  xapi.command('UserInterface Extensions Widget SetValue', {
	         Value: 'Error: Unsupported character entered. Input Cleared.',
	         WidgetId: 'commandText_Field'
	       });
	}

});

xapi.event.on('UserInterface Message Prompt Response', (event) => {
  if (event.OptionId != '5'){
    switch (event.FeedbackId + event.OptionId){
      case 'share1.0'+ event.OptionId:
        userInput = event.OptionId;
        xapi.command('UserInterface Extensions Widget SetValue', {
	         Value: 'Share Source Input: '+ event.OptionId,
	         WidgetId: 'commandText_Field'
	       });
        break;
      default:
        break;
    }
}});
