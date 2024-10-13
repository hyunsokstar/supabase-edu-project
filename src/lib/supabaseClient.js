// C:\new-dankkumi\edu-project\src\lib\supabaseClient.js
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

function SupabaseComponent() {
    const [supabase, setSupabase] = useState(null)

    useEffect(() => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const supabaseInstance = createClient(supabaseUrl, supabaseKey)
        setSupabase(supabaseInstance)
    }, [])

    if (!supabase) return null

    // Supabase를 사용하는 나머지 컴포넌트 로직
    return <div>Supabase is initialized</div>
}

export default SupabaseComponent