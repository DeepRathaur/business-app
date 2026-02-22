'use client';

import { actionType } from '@/core/enum';
import { Ievent } from '@/core/interface';
import React, { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';


interface CustomOtpBoxesProps {
  timer?: number;
  onOtpEvent: (event: Ievent) => void;
  otpLength?: number
}


export default function CustomOtpBoxes({ timer, otpLength, onOtpEvent }: CustomOtpBoxesProps) {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpDisplay, setOtpDisplay] = useState<string>();
  const [remSeconds, seetRemSeconds] = useState<number>();
  const [timing, setTiming] = useState(parseInt(process.env.OTP_TIMER as string));
  // Handle OTP change
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  
    useEffect(() => {
      if (timer && timer > 0) {
        _beginTimer();
      }
    }, [timer]);
  
    const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
      const value = e.target.value.replace(/[^0-9]/g, '');
      if (!value) return;
  
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
  
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
      _onInput(newOtp);
    };
  
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace') {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        if (index > 0) {
          inputsRef.current[index - 1]?.focus();
        }
        _onInput(newOtp);
      } 
      else {
        const value = (e.target as any)?.value?.replace(/[^0-9]/g, '');
        if (!value) return;
    
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    
        if (index < 5) {
          inputsRef.current[index + 1]?.focus();
        }
        _onInput(newOtp);
      }
      
    };
  
    // const handleResend = () => {
    //   // Add resend OTP logic here
    //   setOtp(Array(6).fill(''));
    //   setTimer(59);
    // };

    const numberOnly = (event: ChangeEvent<HTMLInputElement> | React.ClipboardEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
      if('clipboardData' in event){
        if (event.type === 'paste') {
          const clipboardData = event.clipboardData;
          const pastedData = clipboardData.getData('text/plain');
          if (!/^\d+$/.test(pastedData)) {
            event.preventDefault();
            return false ;
          } else {
            for (let i = 0; i < otp.length; i++) { 
              const input = inputsRef.current[i];
              if (input) {
                input.value = pastedData.charAt(i);
                input.focus();
              }
            }
            _onInput();
            return true;
          }
      }
      } else {
        const inputValue = (event as ChangeEvent<HTMLInputElement>).target.value;
        const cleanedValue = inputValue.replace(/[^0-9.]/g, '');
        if (cleanedValue)
          return true 
        else 
          (event as ChangeEvent<HTMLInputElement>).target.value = cleanedValue;
          return false ;
        }
    }

    const _onInput = (otp: string[] = []) => {
      onOtpEvent({
        actionType: actionType.SEND_OTP,
        otp: Object.values(otp).join("")
      })
    }

    const resendOtp = () => {
      // if(timer && timer > 0) {
      //   _beginTimer();
      // }
      onOtpEvent({
        actionType: actionType.RE_SEND_OTP,
        otp: ''
      })
    }

    const _beginTimer = () => {
      let minute = timer;
      let seconds = minute && minute * 60;
      let textSec: any = '0';
      let statSec: number = 60;
      const prefix = minute && minute < 10 ? '0' : '';
    
      const interval = setInterval(() => {
          seconds && seconds--;
          if (statSec != 0) statSec--;
          else statSec = 59;
    
          if (statSec < 10) {
            textSec = '0' + statSec;
          } else textSec = statSec;
    
          
          setOtpDisplay(`${prefix}${Math.floor((seconds as number) / 60)}:${textSec}`);
          seetRemSeconds(seconds);
          if (seconds == 0) {
            clearInterval(interval);
          }
        }, 1000);
      }

  return (
        <div className="mt-4 px-4">
            <div className="flex w-full flex-nowrap justify-between gap-2 max-[385px]:gap-1">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputsRef.current[idx] = el }}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onInput={(e:any) => numberOnly(e)}
                  onPaste={(e) => numberOnly(e)}
                  className="size-11 max-[385px]:'h-12, w-9'
                    shrink-0
                    text-center border border-gray-300 rounded-[3px]
                    focus:ring-2 focus:ring-blue-500 text-black
                    text-base max-[385px]:text-[14px] text-center rounded-lg border bg-white shadow-sm
                    text-2xl max-[320px]:text-xl max-[300px]:text-lg font-semibold text-gray-800
                    border-gray-500 outline-none focus:ring-2 focus:ring-gray-300
                  "
                  aria-label={`OTP digit ${idx + 1}`}
                />
              ))}
            </div>
              

          <section className='flex'>
              <div className="mt-2 text-sm w-full">
                {
                  remSeconds === 0 && <React.Fragment>
                  <span className="text-[#1F2436] hover:underline" onClick={resendOtp}>
                    Resend OTP
                  </span>
                </React.Fragment>
                }
              </div>
              <div className="mt-2 text-sm w-full text-right">
                {
                  remSeconds !== 0 && (
                    <span className="text-xs text-[#1F2436]">{otpDisplay}</span>
                  )
                }
            </div>
          </section>
            
          </div>
  );
}