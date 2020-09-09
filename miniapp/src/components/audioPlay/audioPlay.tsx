import React, {useState, useMemo, useEffect} from 'react';
import Taro from '@tarojs/taro';
import {AtIcon, AtActivityIndicator} from 'taro-ui';
import {View} from '@tarojs/components';

enum Status {
  Default,
  Loading,
  Playing,
}

interface Props {
  audioFileId?: string;
}

const AudioPlay = ({audioFileId = ''}: Props) => {
  const [status, setStatus] = useState(Status.Default);
  const ctx = useMemo(() => Taro.createInnerAudioContext(), []);

  const handlePlayAudio = () => {
    if (status === Status.Playing) return;
    if (!ctx.src) {
      setStatus(Status.Loading);
      ctx.src = audioFileId;
    } else {
      setStatus(Status.Playing);
    }
    ctx.play();
  };
  const handleCanPlay = () => {
    console.log('handle can play');
    ctx.play();
  };
  const handlePlay = () => {
    console.log('handle play');
    setStatus(Status.Playing);
  };
  const handleWaiting = () => {
    console.log('handle waiting');
    setStatus(Status.Loading);
  };
  const handleEnded = () => {
    console.log('handle stop');
    setStatus(Status.Default);
  };

  useEffect(() => {
    ctx.onWaiting(handleWaiting);
    ctx.onCanplay(handleCanPlay);
    ctx.onPlay(handlePlay);
    ctx.onEnded(handleEnded);
    return () => {
      ctx.offWaiting(handleWaiting);
      ctx.offCanplay(handleCanPlay);
      ctx.offPlay(handlePlay);
      ctx.offEnded(handleEnded);
    };
  }, []);
  return (
    <View onClick={handlePlayAudio}>
      {status === Status.Loading && <AtActivityIndicator />}
      {status === Status.Default && <AtIcon value="volume-plus"></AtIcon>}
      {status === Status.Playing && <AtIcon value="play"></AtIcon>}
    </View>
  );
};

export default AudioPlay;
