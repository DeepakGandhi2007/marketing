"use client";
import axios from 'axios';

export default function UpdatePage() {
  const handleUpdate = async () => {
    const response = await axios.get('/api/facebook/get');
    const itemsWithoutDailyBudget = response.data.data.filter(item => !item.dailyBudget);
    const campaignIdsWithoutDailyBudget = itemsWithoutDailyBudget.map(item => item.campaignId);
      const response2 = await axios.post('http://crm-milestonehomes.com:8080/api/facebook/nonbudget', { campaignIds: campaignIdsWithoutDailyBudget });
    console.log(response.data.message);
  };

  return (
    <div>
      <button onClick={handleUpdate}>Update Data</button>
    </div>
  );
}
