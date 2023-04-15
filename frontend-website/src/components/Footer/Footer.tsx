import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './Footer.module.scss'



export default function Footer() {
  return (
    <>
      
      <div className={styles['out__container']}>
      <img src='/footers/footer.png'/>
        </div>
      
        </>
  )
}
