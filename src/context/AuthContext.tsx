import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../supabase/supabaseClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  data: any;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    useEffect(() => {
        const initialiseAuth = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) console.error('Error initialising authorisation:', error);
            setUser(session?.user ?? null);
            setLoading(false);
        }

        initialiseAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const fetchProfile = async () => {
            if (!user) return;

            const { data } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('id', user.id)
                .single();

            setData(data);

            if (data) {
                console.log("Your display name is:", data.display_name);
            }
        };

        fetchProfile();

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, data, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};