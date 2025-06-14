
import React from 'react';
import { Input } from '@/components/ui/input';
import { User, Phone, Mail } from 'lucide-react';

type BasicInfoFieldsProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  signupMethod: 'email' | 'phone';
};

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  firstName,
  lastName,
  email,
  phone,
  setFirstName,
  setLastName,
  setEmail,
  setPhone,
  signupMethod
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1 md:space-y-2">
          <label htmlFor="first-name" className="block text-xs md:text-sm font-medium text-gray-700">
            First Name*
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </span>
            <Input
              id="first-name"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="pl-8 md:pl-10 text-xs md:text-sm h-9 md:h-10"
              required
            />
          </div>
        </div>

        <div className="space-y-1 md:space-y-2">
          <label htmlFor="last-name" className="block text-xs md:text-sm font-medium text-gray-700">
            Last Name*
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </span>
            <Input
              id="last-name"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="pl-8 md:pl-10 text-xs md:text-sm h-9 md:h-10"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-1 md:space-y-2">
        <label htmlFor="phone" className="block text-xs md:text-sm font-medium text-gray-700">
          Phone Number*
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Phone className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </span>
          <Input
            id="phone"
            type="tel"
            placeholder="+250 XXX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pl-8 md:pl-10 text-xs md:text-sm h-9 md:h-10"
            required
          />
        </div>
      </div>

      <div className="space-y-1 md:space-y-2">
        <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700">
          Email Address (Optional)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Mail className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </span>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-8 md:pl-10 text-xs md:text-sm h-9 md:h-10"
          />
        </div>
      </div>
    </>
  );
};

export default BasicInfoFields;
