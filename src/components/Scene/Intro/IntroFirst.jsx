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


  const sceneDescription = "It’s been 4 years since the dead overtook the streets. You and your twin have managed to survive in an old, dilapidated apartment building. The two of you have… unusual abilities, which have undoubtedly helped keep you alive.\nYou live with two other people, Vince and Denise. Your supplies are getting low, so Vince went out a few hours ago to scavenge. He should have been back by now…";

  const testDesc = "Hello my name is blah Hello my name is blah Hello my name is blah"
  return (
    <div className='scene-layout'>
      <Description
        className='descripton-layout'
        setShow={setShow}
        puzzleToChoices={transition} text={sceneDescription} maxLen={55}

        scoketPuzzleToChoices={props.socketPuzzleToChoices}
        socketSetShow={props.socketSetShow}
      ></Description>
      <div style={styleShow} className='show-animation'>
        <div className='heart-right'>
          {mode === CHOICES &&
            <ButtonChoice
              scene={"introSecond"}
              sceneTransition={props.sceneTransition}
              socketSceneTransition={props.socketSceneTransition}
            choice={"Next"}></ButtonChoice>
          }
        </div>
      </div>
    </div>
  )
}