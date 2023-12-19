'use client';
import React from 'react';

import { Button, Result } from 'antd';
import 'antd/dist/antd.css';

const DenyPage: React.FC = () => {
  return (
    <div>
      <Result
        status="error"
        title="Your operation is failed"
        extra={
          <Button type="primary" key="console">
            Go Home
          </Button>
        }
      />
    </div>
  );
};

export default DenyPage;
