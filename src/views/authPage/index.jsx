"use client";

import { Logo, LogoText } from '@/components/logo/index';
import IconGoogle from '@/assets/icons/icon_google.png';
import IconFacebook from '@/assets/icons/icon_facebook.png';
import IconApple from '@/assets/icons/icon_apple.png';
import { Input } from '@/components/inputs/input';
import BackgroundAuthPage from '@/assets/images/background_auth_page.png';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/buttons/iconImageButton';
import Image from 'next/image';

const AuthPage = () => {

  const [isSignIn, setIsSignIn] = useState(true);
  const t = useTranslations("AuthPage");

  return (
    <div className='w-full h-full min-h-screen flex justify-center items-center'>
      <div className='w-fit h-fit flex flex-col justify-center items-center lg:flex-row lg:gap-5'>
        <div className='relative w-full lg:w-[45%] h-fit'>
          <div className={`w-full h-fit py-24 lg:py-0 px-4 absolute lg:top-1/2 lg:-translate-y-1/2 duration-500 ${isSignIn ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <div className='flex flex-row justify-center items-center mb-2'>
              <Logo width={'70'} />
              <LogoText height={'30'} />
            </div>

            <p className='font-bold text-[35px] text-center'>{t('welcome')}</p>
            <p className='font-regular text-[15px] text-center text-black-secondary'>{t('enterDetails')}</p>

            <div className='flex flex-row justify-between gap-4 my-4'>
              <Button iconSrc={IconGoogle} borderWidth='border-[1px]' borderRadius='rounded-lg' width='w-full' height='h-[45px]' borderColor='border-gray-primary' />

              <Button iconSrc={IconFacebook} borderWidth='border-[1px]' borderRadius='rounded-lg' width='w-full' height='h-[45px]' borderColor='border-gray-primary' />

              <Button iconSrc={IconApple} borderWidth='border-[1px]' borderRadius='rounded-lg' width='w-full' height='h-[45px]' borderColor='border-gray-primary' />
            </div>

            <div className='flex flex-row justify-evenly items-center mb-3'>
              <div className='w-[45%] h-[2px] bg-black-tertiary opacity-30'></div>
              <p className='translate-y-2'>{t('or')}</p>
              <div className='w-[45%] h-[2px] bg-black-tertiary opacity-30'></div>
            </div>

            <div>
              <span className='font-bold text-[16px] block my-2'>{t('username')}</span>
              <Input type='email' placeholder={t('username')} />
              <span className='font-bold text-[16px] block my-2'>{t('password')}</span>
              <Input type='password' placeholder={t('password')} />
            </div>

            <div className='flex flex-row items-center justify-between my-3'>
              <label>
                <input type="checkbox" /> {t('rememberMe')}
              </label>
              <a className='text-black-primary' href="#">{t('forgotPassword')}</a>
            </div>

            <div className='my-4'>
              <Button text={t('signIn')} width='w-full' height='h-14' backgroundColor='bg-black-primary' textColor='text-white-primary' borderRadius='rounded-[70px]' />
            </div>

            <div className='flex flex-row justify-center items-center'>
              <span>
                {t('dontHaveAccount')}
              </span>
              <span className='underline ml-2 font-bold cursor-pointer' onClick={() => setIsSignIn(false)}>
                {t('signUpNow')}
              </span>
            </div>
          </div>

          <div className={`w-full h-fit py-24 lg:py-0 px-4 duration-500 ${!isSignIn ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <div className='flex flex-row justify-center items-center mb-2'>
              <Logo width={'70'} />
              <LogoText height={'30'} />
            </div>

            <p className='font-bold text-[35px] text-center'>{t('createAccount')}</p>
            <p className='font-regular text-[15px] text-center text-black-secondary'>{t('createFreeAccount')}</p>

            <div className='flex flex-row justify-between gap-4 my-4'>
              <Button iconSrc={IconGoogle} borderWidth='border-[1px]' borderRadius='rounded-lg' width='w-full' height='h-[45px]' borderColor='border-gray-primary' />

              <Button iconSrc={IconFacebook} borderWidth='border-[1px]' borderRadius='rounded-lg' width='w-full' height='h-[45px]' borderColor='border-gray-primary' />

              <Button iconSrc={IconApple} borderWidth='border-[1px]' borderRadius='rounded-lg' width='w-full' height='h-[45px]' borderColor='border-gray-primary' />
            </div>

            <div className='flex flex-row justify-evenly items-center mb-3'>
              <div className='w-[45%] h-[2px] bg-black-tertiary opacity-30'></div>
              <p className='translate-y-2'>{t('or')}</p>
              <div className='w-[45%] h-[2px] bg-black-tertiary opacity-30'></div>
            </div>

            <div>
              <div className='w-full flex flex-row items-center justify-between'>
                <div className='w-[48%]'>
                  <span className='font-bold text-[16px] block my-2'>{t('firstName')}</span>
                  <Input type='text' placeholder={t('firstName')} />
                </div>
                <div className='w-[48%]'>
                  <span className='font-bold text-[16px] block my-2'>{t('lastName')}</span>
                  <Input type='text' placeholder={t('lastName')} />
                </div>
              </div>
              <span className='font-bold text-[16px] block my-2'>{t('username')}</span>
              <Input type='email' placeholder={t('username')} />
              <div className='w-full flex flex-row items-center justify-between'>
                <div className='w-[48%]'>
                  <span className='font-bold text-[16px] block my-2'>{t('password')}</span>
                  <Input type='password' placeholder={t('password')} />
                </div>
                <div className='w-[48%]'>
                  <span className='font-bold text-[16px] block my-2'>{t('confirmPassword')}</span>
                  <Input type='password' placeholder={t('confirmPassword')} />
                </div>
              </div>
            </div>

            <div className='mt-5 mb-4'>
              <Button text={t('signUp')} width='w-full' height='h-14' backgroundColor='bg-black-primary' textColor='text-white-primary' borderRadius='rounded-[70px]' />
            </div>

            <div className='flex flex-row justify-center items-center'>
              <span>
                {t('alreadyHaveAccount')}
              </span>
              <span className='underline ml-2 font-bold cursor-pointer' onClick={() => setIsSignIn(true)}>
                {t('signInHere')}
              </span>
            </div>
          </div>
        </div>
        <Image className='w-full lg:w-[55%] h-fit' src={BackgroundAuthPage} alt="" />
      </div>
    </div>
  )
}

export default AuthPage;