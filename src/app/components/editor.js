// components/TextEditor.js
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const TextEditor = ({ onChange, defaultValue  }) => {
  const [value, setValue] = useState('');


  const handleChange = (content, delta, source, editor) => {
    setValue(editor.getHTML());
    onChange(content); 
  };
  
  

  return (
    <div>
      <ReactQuill defaultValue={defaultValue ? defaultValue : value} onChange={handleChange} />
    </div>
  );
};

export default TextEditor;
