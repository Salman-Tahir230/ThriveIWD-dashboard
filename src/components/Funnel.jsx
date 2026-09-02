import React from 'react';
import { funnelData } from '../data/mockData';

export default function Funnel() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Session Funnel</h2>
        <div className="group relative flex items-center">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold cursor-help" aria-label="Drop-off explanation">
            ?
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-xs rounded shadow-lg z-10 text-center">
            "Drop-off" shows the percentage of users who leave the site without proceeding to the next step.
            <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-slate-900"></div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-1 w-full max-w-2xl mx-auto">
        {funnelData.map((step, index) => {
          const isLast = index === funnelData.length - 1;
          const nextStep = !isLast ? funnelData[index + 1] : null;
          // Calculate drop-off as the percentage of people from this stage that did NOT make it to the next
          const dropOff = nextStep ? Math.round(((step.count - nextStep.count) / step.count) * 100) : 0;
          
          // Width scaled relative to the max count (which is 100 in this case)
          const widthPercent = `${step.count}%`;
          
          return (
            <React.Fragment key={step.stage}>
              <div 
                className="bg-indigo-500 dark:bg-indigo-600 rounded flex items-center justify-between px-4 py-3 text-white font-medium shadow-sm w-full transition-all"
                style={{ width: widthPercent, minWidth: '150px' }}
              >
                <span>{step.stage}</span>
                <span>{step.count}%</span>
              </div>
              
              {!isLast && (
                <div className="flex flex-col items-center text-slate-400 dark:text-slate-500 text-sm font-medium py-1">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    {dropOff}% drop-off
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
