import React from 'react';
import { storiesOf } from "@storybook/react";
// import { action } from "@storybook/addon-actions";
import Timer from '../components/Scene-component/Timer';

storiesOf("Timer", module)
  .add("Countdown", () => <Timer></Timer>)
