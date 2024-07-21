import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { getApiLimitCount } from '@/lib/api-limit';

import { auth, currentUser } from '@clerk/nextjs/server';
import axios from 'axios';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentlyLoggedInUser = await currentUser();
  console.log(currentlyLoggedInUser);

  let userApiCount;

  const userEmail = currentlyLoggedInUser?.emailAddresses[0].emailAddress;

  const user = await axios.get(
    `http://localhost:3001/users/email?email=${userEmail}`,
  );

  if (!user) {
    try {
      const response = await axios.post(`http://localhost:3001/users`, {
        first_name: currentlyLoggedInUser?.firstName,
        last_name: currentlyLoggedInUser?.lastName,
        email: currentlyLoggedInUser?.emailAddresses[0].emailAddress,
      });
    } catch (error) {
      console.error(error);
    }
  }

  try {
    const apiCount = await axios.get(
      `http://localhost:3001/api/users/${user.data.id}`,
    );

    if (apiCount.data) {
      userApiCount = apiCount.data.count;
    }

    // Add validation to createApiCount if there is no user.data.id (undefined)
    if (!apiCount.data) {
      const newApiCount = await axios.post(`http://localhost:3001/api`, {
        userId: user.data.id,
      });

      userApiCount = newApiCount.data.count;
    }
  } catch (err) {
    console.error(err);
  }

  setTimeout(async () => {
    await axios.put(`http://localhost:3001/api/reset/${user.data.id}`);
    userApiCount = 0;
  }, 60000);

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar userApiCount={userApiCount} />
      </div>
      <main className="md:pl-72">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
