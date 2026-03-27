import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { X, Globe } from 'lucide-react';

// Predefined list of common timezones with country flags
// Israel has been removed, Palestine added with its timezone
const COMMON_TIMEZONES = [
  { country: '🇦🇫 Afghanistan', tz: 'Asia/Kabul' },
  { country: '🇦🇱 Albania', tz: 'Europe/Tirane' },
  { country: '🇩🇿 Algeria', tz: 'Africa/Algiers' },
  { country: '🇦🇩 Andorra', tz: 'Europe/Andorra' },
  { country: '🇦🇴 Angola', tz: 'Africa/Luanda' },
  { country: '🇦🇬 Antigua and Barbuda', tz: 'America/Antigua' },
  { country: '🇦🇷 Argentina', tz: 'America/Argentina/Buenos_Aires' },
  { country: '🇦🇲 Armenia', tz: 'Asia/Yerevan' },
  { country: '🇦🇺 Australia', tz: 'Australia/Sydney' }, // multiple timezones, using major city
  { country: '🇦🇹 Austria', tz: 'Europe/Vienna' },
  { country: '🇦🇿 Azerbaijan', tz: 'Asia/Baku' },
  { country: '🇧🇸 Bahamas', tz: 'America/Nassau' },
  { country: '🇧🇭 Bahrain', tz: 'Asia/Bahrain' },
  { country: '🇧🇩 Bangladesh', tz: 'Asia/Dhaka' },
  { country: '🇧🇧 Barbados', tz: 'America/Barbados' },
  { country: '🇧🇾 Belarus', tz: 'Europe/Minsk' },
  { country: '🇧🇪 Belgium', tz: 'Europe/Brussels' },
  { country: '🇧🇿 Belize', tz: 'America/Belize' },
  { country: '🇧🇯 Benin', tz: 'Africa/Porto-Novo' },
  { country: '🇧🇹 Bhutan', tz: 'Asia/Thimphu' },
  { country: '🇧🇴 Bolivia', tz: 'America/La_Paz' },
  { country: '🇧🇦 Bosnia and Herzegovina', tz: 'Europe/Sarajevo' },
  { country: '🇧🇼 Botswana', tz: 'Africa/Gaborone' },
  { country: '🇧🇷 Brazil', tz: 'America/Sao_Paulo' }, // multiple
  { country: '🇧🇳 Brunei', tz: 'Asia/Brunei' },
  { country: '🇧🇬 Bulgaria', tz: 'Europe/Sofia' },
  { country: '🇧🇫 Burkina Faso', tz: 'Africa/Ouagadougou' },
  { country: '🇧🇮 Burundi', tz: 'Africa/Bujumbura' },
  { country: '🇨🇻 Cabo Verde', tz: 'Atlantic/Cape_Verde' },
  { country: '🇰🇭 Cambodia', tz: 'Asia/Phnom_Penh' },
  { country: '🇨🇲 Cameroon', tz: 'Africa/Douala' },
  { country: '🇨🇦 Canada', tz: 'America/Toronto' }, // multiple
  { country: '🇨🇫 Central African Republic', tz: 'Africa/Bangui' },
  { country: '🇹🇩 Chad', tz: 'Africa/Ndjamena' },
  { country: '🇨🇱 Chile', tz: 'America/Santiago' },
  { country: '🇨🇳 China', tz: 'Asia/Shanghai' },
  { country: '🇨🇴 Colombia', tz: 'America/Bogota' },
  { country: '🇰🇲 Comoros', tz: 'Indian/Comoro' },
  { country: '🇨🇬 Congo', tz: 'Africa/Brazzaville' },
  { country: '🇨🇷 Costa Rica', tz: 'America/Costa_Rica' },
  { country: '🇨🇮 Côte d’Ivoire', tz: 'Africa/Abidjan' },
  { country: '🇭🇷 Croatia', tz: 'Europe/Zagreb' },
  { country: '🇨🇺 Cuba', tz: 'America/Havana' },
  { country: '🇨🇾 Cyprus', tz: 'Asia/Nicosia' },
  { country: '🇨🇿 Czech Republic', tz: 'Europe/Prague' },
  { country: '🇩🇰 Denmark', tz: 'Europe/Copenhagen' },
  { country: '🇩🇯 Djibouti', tz: 'Africa/Djibouti' },
  { country: '🇩🇲 Dominica', tz: 'America/Dominica' },
  { country: '🇩🇴 Dominican Republic', tz: 'America/Santo_Domingo' },
  { country: '🇪🇨 Ecuador', tz: 'America/Guayaquil' },
  { country: '🇪🇬 Egypt', tz: 'Africa/Cairo' },
  { country: '🇸🇻 El Salvador', tz: 'America/El_Salvador' },
  { country: '🇬🇶 Equatorial Guinea', tz: 'Africa/Malabo' },
  { country: '🇪🇷 Eritrea', tz: 'Africa/Asmara' },
  { country: '🇪🇪 Estonia', tz: 'Europe/Tallinn' },
  { country: '🇸🇿 Eswatini', tz: 'Africa/Mbabane' },
  { country: '🇪🇹 Ethiopia', tz: 'Africa/Addis_Ababa' },
  { country: '🇫🇯 Fiji', tz: 'Pacific/Fiji' },
  { country: '🇫🇮 Finland', tz: 'Europe/Helsinki' },
  { country: '🇫🇷 France', tz: 'Europe/Paris' },
  { country: '🇬🇦 Gabon', tz: 'Africa/Libreville' },
  { country: '🇬🇲 Gambia', tz: 'Africa/Banjul' },
  { country: '🇬🇪 Georgia', tz: 'Asia/Tbilisi' },
  { country: '🇩🇪 Germany', tz: 'Europe/Berlin' },
  { country: '🇬🇭 Ghana', tz: 'Africa/Accra' },
  { country: '🇬🇷 Greece', tz: 'Europe/Athens' },
  { country: '🇬🇩 Grenada', tz: 'America/Grenada' },
  { country: '🇬🇹 Guatemala', tz: 'America/Guatemala' },
  { country: '🇬🇳 Guinea', tz: 'Africa/Conakry' },
  { country: '🇬🇼 Guinea-Bissau', tz: 'Africa/Bissau' },
  { country: '🇬🇾 Guyana', tz: 'America/Guyana' },
  { country: '🇭🇹 Haiti', tz: 'America/Port-au-Prince' },
  { country: '🇭🇳 Honduras', tz: 'America/Tegucigalpa' },
  { country: '🇭🇺 Hungary', tz: 'Europe/Budapest' },
  { country: '🇮🇸 Iceland', tz: 'Atlantic/Reykjavik' },
  { country: '🇮🇳 India', tz: 'Asia/Kolkata' },
  { country: '🇮🇩 Indonesia', tz: 'Asia/Jakarta' }, // multiple
  { country: '🇮🇷 Iran', tz: 'Asia/Tehran' },
  { country: '🇮🇶 Iraq', tz: 'Asia/Baghdad' },
  { country: '🇮🇪 Ireland', tz: 'Europe/Dublin' },
  { country: '🇮🇹 Italy', tz: 'Europe/Rome' },
  { country: '🇯🇲 Jamaica', tz: 'America/Jamaica' },
  { country: '🇯🇵 Japan', tz: 'Asia/Tokyo' },
  { country: '🇯🇴 Jordan', tz: 'Asia/Amman' },
  { country: '🇰🇿 Kazakhstan', tz: 'Asia/Almaty' },
  { country: '🇰🇪 Kenya', tz: 'Africa/Nairobi' },
  { country: '🇰🇮 Kiribati', tz: 'Pacific/Tarawa' },
  { country: '🇰🇵 North Korea', tz: 'Asia/Pyongyang' },
  { country: '🇰🇷 South Korea', tz: 'Asia/Seoul' },
  { country: '🇽🇰 Kosovo', tz: 'Europe/Belgrade' }, // unofficial, uses Serbia time
  { country: '🇰🇼 Kuwait', tz: 'Asia/Kuwait' },
  { country: '🇰🇬 Kyrgyzstan', tz: 'Asia/Bishkek' },
  { country: '🇱🇦 Laos', tz: 'Asia/Vientiane' },
  { country: '🇱🇻 Latvia', tz: 'Europe/Riga' },
  { country: '🇱🇧 Lebanon', tz: 'Asia/Beirut' },
  { country: '🇱🇸 Lesotho', tz: 'Africa/Maseru' },
  { country: '🇱🇷 Liberia', tz: 'Africa/Monrovia' },
  { country: '🇱🇾 Libya', tz: 'Africa/Tripoli' },
  { country: '🇱🇮 Liechtenstein', tz: 'Europe/Vaduz' },
  { country: '🇱🇹 Lithuania', tz: 'Europe/Vilnius' },
  { country: '🇱🇺 Luxembourg', tz: 'Europe/Luxembourg' },
  { country: '🇲🇬 Madagascar', tz: 'Indian/Antananarivo' },
  { country: '🇲🇼 Malawi', tz: 'Africa/Blantyre' },
  { country: '🇲🇾 Malaysia', tz: 'Asia/Kuala_Lumpur' },
  { country: '🇲🇻 Maldives', tz: 'Indian/Maldives' },
  { country: '🇲🇱 Mali', tz: 'Africa/Bamako' },
  { country: '🇲🇹 Malta', tz: 'Europe/Malta' },
  { country: '🇲🇭 Marshall Islands', tz: 'Pacific/Majuro' },
  { country: '🇲🇷 Mauritania', tz: 'Africa/Nouakchott' },
  { country: '🇲🇺 Mauritius', tz: 'Indian/Mauritius' },
  { country: '🇲🇽 Mexico', tz: 'America/Mexico_City' },
  { country: '🇫🇲 Micronesia', tz: 'Pacific/Chuuk' },
  { country: '🇲🇩 Moldova', tz: 'Europe/Chisinau' },
  { country: '🇲🇨 Monaco', tz: 'Europe/Monaco' },
  { country: '🇲🇳 Mongolia', tz: 'Asia/Ulaanbaatar' },
  { country: '🇲🇪 Montenegro', tz: 'Europe/Podgorica' },
  { country: '🇲🇦 Morocco', tz: 'Africa/Casablanca' },
  { country: '🇲🇿 Mozambique', tz: 'Africa/Maputo' },
  { country: '🇲🇲 Myanmar', tz: 'Asia/Yangon' },
  { country: '🇳🇦 Namibia', tz: 'Africa/Windhoek' },
  { country: '🇳🇷 Nauru', tz: 'Pacific/Nauru' },
  { country: '🇳🇵 Nepal', tz: 'Asia/Kathmandu' },
  { country: '🇳🇱 Netherlands', tz: 'Europe/Amsterdam' },
  { country: '🇳🇿 New Zealand', tz: 'Pacific/Auckland' },
  { country: '🇳🇮 Nicaragua', tz: 'America/Managua' },
  { country: '🇳🇪 Niger', tz: 'Africa/Niamey' },
  { country: '🇳🇬 Nigeria', tz: 'Africa/Lagos' },
  { country: '🇲🇰 North Macedonia', tz: 'Europe/Skopje' },
  { country: '🇳🇴 Norway', tz: 'Europe/Oslo' },
  { country: '🇴🇲 Oman', tz: 'Asia/Muscat' },
  { country: '🇵🇰 Pakistan', tz: 'Asia/Karachi' },
  { country: '🇵🇼 Palau', tz: 'Pacific/Palau' },
  { country: '🇵🇸 Palestine', tz: 'Asia/Hebron' },
    { country: '🇵🇦 Panama', tz: 'America/Panama' },
  { country: '🇵🇬 Papua New Guinea', tz: 'Pacific/Port_Moresby' },
  { country: '🇵🇾 Paraguay', tz: 'America/Asuncion' },
  { country: '🇵🇪 Peru', tz: 'America/Lima' },
  { country: '🇵🇭 Philippines', tz: 'Asia/Manila' },
  { country: '🇵🇱 Poland', tz: 'Europe/Warsaw' },
  { country: '🇵🇹 Portugal', tz: 'Europe/Lisbon' },
  { country: '🇶🇦 Qatar', tz: 'Asia/Qatar' },
  { country: '🇷🇴 Romania', tz: 'Europe/Bucharest' },
  { country: '🇷🇺 Russia', tz: 'Europe/Moscow' }, // multiple timezones, using Moscow
  { country: '🇷🇼 Rwanda', tz: 'Africa/Kigali' },
  { country: '🇰🇳 Saint Kitts and Nevis', tz: 'America/St_Kitts' },
  { country: '🇱🇨 Saint Lucia', tz: 'America/St_Lucia' },
  { country: '🇻🇨 Saint Vincent and the Grenadines', tz: 'America/St_Vincent' },
  { country: '🇼🇸 Samoa', tz: 'Pacific/Apia' },
  { country: '🇸🇲 San Marino', tz: 'Europe/San_Marino' },
  { country: '🇸🇹 Sao Tome and Principe', tz: 'Africa/Sao_Tome' },
  { country: '🇸🇦 Saudi Arabia', tz: 'Asia/Riyadh' },
  { country: '🇸🇳 Senegal', tz: 'Africa/Dakar' },
  { country: '🇷🇸 Serbia', tz: 'Europe/Belgrade' },
  { country: '🇸🇨 Seychelles', tz: 'Indian/Mahe' },
  { country: '🇸🇱 Sierra Leone', tz: 'Africa/Freetown' },
  { country: '🇸🇬 Singapore', tz: 'Asia/Singapore' },
  { country: '🇸🇰 Slovakia', tz: 'Europe/Bratislava' },
  { country: '🇸🇮 Slovenia', tz: 'Europe/Ljubljana' },
  { country: '🇸🇧 Solomon Islands', tz: 'Pacific/Guadalcanal' },
  { country: '🇸🇴 Somalia', tz: 'Africa/Mogadishu' },
  { country: '🇿🇦 South Africa', tz: 'Africa/Johannesburg' },
  { country: '🇪🇸 Spain', tz: 'Europe/Madrid' },
  { country: '🇱🇰 Sri Lanka', tz: 'Asia/Colombo' },
  { country: '🇸🇩 Sudan', tz: 'Africa/Khartoum' },
  { country: '🇸🇷 Suriname', tz: 'America/Paramaribo' },
  { country: '🇸🇪 Sweden', tz: 'Europe/Stockholm' },
  { country: '🇨🇭 Switzerland', tz: 'Europe/Zurich' },
  { country: '🇸🇾 Syria', tz: 'Asia/Damascus' },
  { country: '🇹🇼 Taiwan', tz: 'Asia/Taipei' },
  { country: '🇹🇯 Tajikistan', tz: 'Asia/Dushanbe' },
  { country: '🇹🇿 Tanzania', tz: 'Africa/Dar_es_Salaam' },
  { country: '🇹🇭 Thailand', tz: 'Asia/Bangkok' },
  { country: '🇹🇱 Timor-Leste', tz: 'Asia/Dili' },
  { country: '🇹🇬 Togo', tz: 'Africa/Lome' },
  { country: '🇹🇴 Tonga', tz: 'Pacific/Tongatapu' },
  { country: '🇹🇹 Trinidad and Tobago', tz: 'America/Port_of_Spain' },
  { country: '🇹🇳 Tunisia', tz: 'Africa/Tunis' },
  { country: '🇹🇷 Turkey', tz: 'Europe/Istanbul' },
  { country: '🇹🇲 Turkmenistan', tz: 'Asia/Ashgabat' },
  { country: '🇹🇻 Tuvalu', tz: 'Pacific/Funafuti' },
  { country: '🇺🇬 Uganda', tz: 'Africa/Kampala' },
  { country: '🇺🇦 Ukraine', tz: 'Europe/Kyiv' },
  { country: '🇦🇪 United Arab Emirates', tz: 'Asia/Dubai' },
  { country: '🇬🇧 United Kingdom', tz: 'Europe/London' },
  { country: '🇺🇸 United States', tz: 'America/New_York' }, // multiple timezones
  { country: '🇺🇾 Uruguay', tz: 'America/Montevideo' },
  { country: '🇺🇿 Uzbekistan', tz: 'Asia/Tashkent' },
  { country: '🇻🇺 Vanuatu', tz: 'Pacific/Efate' },
  { country: '🇻🇦 Vatican City', tz: 'Europe/Vatican' },
  { country: '🇻🇪 Venezuela', tz: 'America/Caracas' },
  { country: '🇻🇳 Vietnam', tz: 'Asia/Ho_Chi_Minh' },
  { country: '🇾🇪 Yemen', tz: 'Asia/Aden' },
  { country: '🇿🇲 Zambia', tz: 'Africa/Lusaka' },
  { country: '🇿🇼 Zimbabwe', tz: 'Africa/Harare' }
];

export const WorldClock = ({ timezones, setTimezones, is24Hour, now }) => {
  const [newTz, setNewTz] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const addTimezone = (tz) => {
    if (tz && !timezones.includes(tz)) {
      setTimezones([...timezones, tz]);
    }
  };

  const addFromDropdown = () => {
    if (selectedCountry) {
      addTimezone(selectedCountry);
      setSelectedCountry('');
    }
  };

  const removeTimezone = (tz) => {
    setTimezones(timezones.filter(t => t !== tz));
  };

  // Business hours overlap (9am-5pm local time for each timezone)
  const getBusinessOverlap = () => {
    const overlap = [];
    timezones.forEach(tz => {
      try {
        const hour = parseInt(
          now.toLocaleTimeString('en-US', {
            timeZone: tz === 'local' ? undefined : tz,
            hour: 'numeric',
            hour12: false,
          })
        );
        if (hour >= 9 && hour <= 17) {
          overlap.push(tz === 'local' ? 'Local' : tz.split('/').pop().replace(/_/g, ' '));
        }
      } catch (e) {
        // ignore invalid tz
      }
    });
    return overlap;
  };

  const overlap = getBusinessOverlap();

  return (
    <Card title="World Clock" icon={<Globe className="w-6 h-6" />}>
      {/* Dropdown for common timezones */}
      <div className="flex gap-2 mb-3">
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            backgroundSize: '1.25rem',
          }}
        >
          <option value="" className="bg-gray-800">Select a country...</option>
          {COMMON_TIMEZONES.map((item) => (
            <option key={item.tz} value={item.tz} className="bg-gray-800">
              {item.country}
            </option>
          ))}
        </select>
        <Button onClick={addFromDropdown} size="sm" disabled={!selectedCountry}>
          Add
        </Button>
      </div>

      {/* Manual entry */}
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Or type timezone (e.g., Asia/Hebron)"
          value={newTz}
          onChange={(e) => setNewTz(e.target.value)}
          className="flex-1"
        />
        <Button onClick={() => addTimezone(newTz)} size="sm" disabled={!newTz}>
          Add
        </Button>
      </div>

      {/* Timezone list */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mb-3">
        {timezones.map((tz) => {
          try {
            const time = now.toLocaleTimeString('en-US', {
              timeZone: tz === 'local' ? undefined : tz,
              hour12: !is24Hour,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
            // Find matching country flag if available
            const match = COMMON_TIMEZONES.find(item => item.tz === tz);
            const displayName = match ? match.country : (tz === 'local' ? '📍 Local' : tz.split('/').pop().replace(/_/g, ' '));
            
            return (
              <div key={tz} className="flex items-center justify-between bg-white/10 rounded-full px-4 py-2">
                <span className="text-sm truncate">{displayName}</span>
                <span className="text-sm font-mono">{time}</span>
                <button
                  onClick={() => removeTimezone(tz)}
                  className="ml-2 text-red-300 hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            );
          } catch (e) {
            return null;
          }
        })}
      </div>

      {/* Business hours overlap */}
      <div className="mt-3 text-sm bg-green-500/20 rounded-full px-4 py-2">
        {overlap.length > 0
          ? `✅ Business hours overlap: ${overlap.join(', ')}`
          : '⏰ No business hours overlap'}
      </div>
    </Card>
  );
};