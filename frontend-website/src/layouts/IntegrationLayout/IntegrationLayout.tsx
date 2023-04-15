import React from 'react'
import styles from './IntegrationLayout.module.scss'
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
interface PageLayoutProps {
  children?: React.ReactNode
}

const IntegrationLayout: React.FC<PageLayoutProps> = ({
  children,
}) => {
  return (

      <div className={styles['wrapper']}>
        <div className={styles['page__content__container']}>
            {children}
        </div>
      </div>
   
  )
}

export default IntegrationLayout