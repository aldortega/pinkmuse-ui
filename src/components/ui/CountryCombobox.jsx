import { useMemo, useState } from "react";
import { getCountryOptionsES } from "@/lib/countryOptions";
import ReactCountryFlag from "react-country-flag";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";

export default function CountryCombobox({
  value,
  onChange,
  placeholder = "Buscar país…",
}) {
  const [open, setOpen] = useState(false);
  const options = useMemo(() => getCountryOptionsES(), []);

  // Ahora buscamos por nombre en lugar de código
  const current = options.find((o) => o.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-100 border-gray-300 text-gray-900 cursor-pointer"
        >
          {current ? (
            <span className="inline-flex items-center gap-2">
              <ReactCountryFlag
                countryCode={current.code}
                svg
                style={{ width: "1.1em", height: "1.1em" }}
              />
              {current.name}
            </span>
          ) : (
            "Selecciona un país"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] p-0 border border-gray-300">
        <Command className="bg-violet-100">
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>Sin resultados…</CommandEmpty>
          <CommandList>
            {options.map((opt) => (
              <CommandItem
                className="cursor-pointer"
                key={opt.code}
                value={opt.name}
                onSelect={() => {
                  onChange?.(opt.name); // <<--- ahora guarda el NOMBRE
                  setOpen(false);
                }}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    value === opt.name ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span className="inline-flex items-center gap-2">
                  <ReactCountryFlag
                    countryCode={opt.code}
                    svg
                    style={{ width: "1.1em", height: "1.1em" }}
                  />
                  {opt.name}
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
