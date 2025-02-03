'use client'

import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

/** Display bar chart breaking out running pace percentages.
 * Used in weekly-training-stats component to display the chart for each week.  
*/

export function RunPercentages({percentages} : {percentages: Record<string, number>}) {

    const [dataset, setDataset] = useState<Array<Record<string, string | number[]>>>([])

    useEffect(() => {
        let ignore = false;
        if (!ignore) {
            const res: Array<Record<string, string | number[]>>  = [];
            Object.entries(percentages).forEach(([key, value]) => {
                
                res.push({data: [value * 100], label: key});
            })

            setDataset(res);
        }

        return () => {ignore = true};
    }, [percentages]);

    

    return (
        <div className='grid grid-cols-1 justify-items-center mt-6'>
            <p className='text-2xl text-center mb-3'>PACE BREAKDOWN</p>
            <BarChart
                series={[
                    {data: [percentages['easy']], label: 'Easy', stack: 'total'},
                    {data: [percentages['aerobic']], label: 'Aerobic', stack: 'total'},
                    {data: [percentages['mp']], label: 'Marathon', stack: 'total'},
                    {data: [percentages['hm']], label: 'Half Marathon', stack: 'total'},
                    {data: [percentages['10K']], label: '10K', stack: 'total'},
                    {data: [percentages['5K']], label: '5K', stack: 'total'}
                ]}
                layout='horizontal'
                height={350}
                width={600}
            
            />
        </div>
        
           
      
    )



}