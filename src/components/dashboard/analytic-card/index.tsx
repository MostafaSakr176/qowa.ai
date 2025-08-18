import React from 'react'

type AnalyticCardProps = {
    title: string
    value: string | number
    icon?: React.ReactNode
}

const AnalyticCard: React.FC<AnalyticCardProps> = ({
    title,
    value,
    icon,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-xl shadow-[#0A0D1408] border border-[#E9ECEF] py-4 px-6 flex items-center justify-between" style={{ boxShadow: '0 2px 8px 0 #F1F3F6' }}>
            <div>
                <div className="text-gray-700 text-lg font-medium mb-1">{title}</div>
                <div className="text-2xl font-bold text-black">{value}</div>
            </div>
            <div className="flex items-center text-primary justify-center w-12 h-12 rounded-lg border border-[#E9ECEF] bg-white">
                {icon ? (
                    icon
                ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="#0090FF" strokeWidth="2" fill="none" />
                        <path d="M12 7v10M9.5 9.5A2.5 2.5 0 0112 7a2.5 2.5 0 012.5 2.5c0 1.38-1.12 2.5-2.5 2.5s-2.5 1.12-2.5 2.5A2.5 2.5 0 0012 17a2.5 2.5 0 002.5-2.5" stroke="#0090FF" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                )}
            </div>
        </div>
    )
}

export default AnalyticCard