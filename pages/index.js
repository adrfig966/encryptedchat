import { useState, useEffect } from 'react';
import Wrapper from '../layouts/main.js'
import io from 'socket.io-client';

const socket = io();

function HomePage () {

    return (
      <Wrapper>
        <div className="text-center">
          Go to /rooms/ followed by any word to start
        </div>
      </Wrapper>
    )
}

export default HomePage
