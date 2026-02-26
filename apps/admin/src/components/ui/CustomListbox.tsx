// apps/admin/src/components/ui/CustomListbox.tsx
'use client';

import { useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export interface Option {
    value: string;
    label: string;
}

interface CustomListboxProps {
    name: string;
    options: Option[];
    defaultValue?: string;
    placeholder?: string;
}

export function CustomListbox({ name, options, defaultValue, placeholder = "Sélectionner..." }: CustomListboxProps) {
    // Initialisation avec la valeur par défaut passée par l'URL (searchParams)
    const [selected, setSelected] = useState<Option>(
        options.find((o) => o.value === defaultValue) || { value: '', label: placeholder }
    );

    return (
        <Listbox value={selected} onChange={setSelected}>
            <div className="relative w-full">
                {/* Le secret pour le SSR / Formulaires Natifs : l'input caché */}
                <input type="hidden" name={name} value={selected.value} />

                <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-xl bg-white h-11 py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1A3C9F] sm:text-sm/6 shadow-sm">
                    <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                        <span className="block truncate font-medium">{selected.label}</span>
                    </span>
                    <ChevronUpDownIcon
                        aria-hidden="true"
                        className="col-start-1 row-start-1 h-5 w-5 self-center justify-self-end text-gray-400 sm:h-4 sm:w-4"
                    />
                </ListboxButton>

                <ListboxOptions
                    transition
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                >
                    {options.map((option) => (
                        <ListboxOption
                            key={option.value}
                            value={option}
                            className="group relative cursor-default select-none py-2.5 pl-3 pr-9 text-gray-900 data-[focus]:bg-[#1A3C9F] data-[focus]:text-white data-[focus]:outline-none"
                        >
                            <span className="block truncate font-normal group-data-[selected]:font-bold">
                                {option.label}
                            </span>

                            {/* L'icône Check n'apparait que si l'option est sélectionnée */}
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#1A3C9F] group-not-[data-[selected]]:hidden group-data-[focus]:text-white">
                                <CheckIcon aria-hidden="true" className="h-5 w-5" />
                            </span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
}