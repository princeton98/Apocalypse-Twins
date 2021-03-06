import React, {useEffect, useState} from "react";
import Description from '../../Scene-component/Description';
import ButtonChoice from '../../Scene-component/ButtonChoice';

import { webSocket } from '../../../webSocket';

export default function IntroFirst(props) {

  function usePuzzleToChoices(initial) {
    const [history, setHistory] = useState([initial]);
  
    function transition(changeMode, replace = false) {
      setHistory(prev => {
        if (replace) {
          return [changeMode, ...prev.slice(1)];
        } else {
          return [changeMode, ...prev];
        }
      });
    }
  
    function back() {
      setHistory(prev => {
        if (prev.length > 1) {
          return prev.slice(1);
        } else {
          return prev;
        }
      });
    }
  
    return {mode: history[0], transition, back };
  }

  const CHOICES = 'Choices'

  const { mode, transition } = usePuzzleToChoices('Choices')
  const [show, setShow] = useState(false)
  const styleShow = show ? {} : {visibility: 'hidden'}

  useEffect(() => {
    webSocket.on('puzzle to choices', (message) => {
      transition(message);
    });

    webSocket.on('show', (message) => {
      setShow(message);
    });

    return function cleanup() {
      webSocket.off('puzzle to choices');
      webSocket.off('show');
    }

  }, [])

  const sceneDescription = "You hear a groan from the other side. Denise opens the door and Vince slumps in, badly injured. Denise’s face goes pale. \“This doesn’t look good…\” \nGetting him to the couch, Denise looks over the wound. \“He’s going to need serious medicine. Medicine we don’t have.\” She looks at the two of you.";

  const testDesc = "Hello my name is blah Hello my name is blah Hello my name is blah"
  return (
    <div className='scene-layout'>
      <Description 
        className='descripton-layout' 
        setShow={setShow} 
        puzzleToChoices={transition} 
        text={sceneDescription} 
        maxLen={55}

        scoketPuzzleToChoices={props.socketPuzzleToChoices}
        socketSetShow={props.socketSetShow}
      ></Description>
      <div style={styleShow} className='show-animation'>
        <div className='heart-right'>
            {mode === CHOICES &&
              <ButtonChoice 
                scene={"introFifth"} 
                sceneTransition={props.sceneTransition} 
                choice={"Next"}

                socketSceneTransition={props.socketSceneTransition}
                
              ></ButtonChoice>
            }
        </div>
      </div>
    </div>
  )
}