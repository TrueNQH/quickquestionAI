import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { overviewData, recentSalesData, topProducts } from "@/constants";
import { Footer } from "@/layouts/footer";
import { CreditCard, DollarSign, Package, PencilLine, Star, Trash, TrendingUp, Users } from "lucide-react";
import TokenGenerator from "./Token";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/api.config";
import OverviewChart from "./Chart";
const DashboardPage = () => {
    const { theme } = useTheme();
    const {user} = useAuth();
    let free_trial_expiry = user ? new Date(user.free_trial_expiry) : null;
    let formattedExpiryDate = "";

    // Nếu user và free_trial_expiry không phải null, định dạng lại ngày hết hạn
    if (free_trial_expiry) {
        formattedExpiryDate = free_trial_expiry.toLocaleDateString();
    } else {
        formattedExpiryDate = "No expiry date set"; // Nếu không có giá trị free_trial_expiry
    }
    return (
        <div className="flex flex-col gap-y-4">
            
            <TokenGenerator/>
        
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-7">
    {/* Card biểu đồ lớn */}
    <div className="card col-span-1 md:col-span-2 lg:col-span-5">
        <div className="card-header">
            <p className="card-title">Overview</p>
        </div>
        <div className="card-body p-0">
           <OverviewChart />
        </div>
    </div>

    {/* Container chứa 2 card nhỏ */}
    <div className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col gap-4 h-full">
        {/* Card Số dư 1 */}
        <div className="card flex-1">
            <div className="card-header">
                <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                    <CreditCard size={26} />
                </div>
                <p className="card-title">Expiry</p>
            </div>
            <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{formattedExpiryDate || 100}</p>
                {/* <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                    <TrendingUp size={18} />
                    19%
                </span> */}
            </div>
        </div>
        
        {/* Card Số dư 2 */}
        <div className="card flex-1">
            <div className="card-header">
                <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                    <CreditCard size={26} />
                </div>
                <p className="card-title">Số request</p>
            </div>
            <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">{user?.request_limit || 100}</p>
                <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                    <TrendingUp size={18} />
                    19%
                </span>
            </div>
        </div>

        
    </div>
    
</div>

            
            <Footer />
        </div>
    );
};

export default DashboardPage;
