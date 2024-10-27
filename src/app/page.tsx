import ZustandCounter from '@/components/test/ZustandCounter'
import React from 'react'

type Props = {}

const HomePage = (props: Props) => {
  return (
    <div>
      기본 페이지
      <ZustandCounter />
    </div>
  )
}

export default HomePage