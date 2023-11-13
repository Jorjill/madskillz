import React from 'react';
import { ItemsList } from '../items-list/ItemsList';

const Component1: React.FC = () => {

  const notes = [{title:"title1",content:"content1"},{title:"title2",content:"content2"},{title:"title3",content:"content3"}];

  return(
    <div>
      <ItemsList itemsList={notes} />
    </div>
  )
};

export default Component1;