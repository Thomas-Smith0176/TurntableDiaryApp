// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';

// export const SearchBar = (query: string, setQuery: (text: string) => void, handleSearch: (text: string) => void, results: any[]) => {
//     return (
//         <View style={{ flex: 1, padding: 20 }}>
//         <TextInput
//             placeholder="Search for an album..."
//             value={query}
//             onChangeText={setQuery}
//             onSubmitEditing={handleSearch} // Trigger search on "Enter"
//             style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 8 }}
//         />

//         <FlatList
//             data={results}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//             <TouchableOpacity onPress={() => console.log('Selected:', item.name)}>
//                 <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
//                 <Image 
//                     source={{ uri: item.thumbnail }} 
//                     style={{ width: 50, height: 50, borderRadius: 4 }} 
//                 />
//                 <View style={{ marginLeft: 10 }}>
//                     <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
//                     <Text style={{ color: 'gray' }}>{item.artist}</Text>
//                 </View>
//                 </View>
//             </TouchableOpacity>
//             )}
//         />
//         </View>
//     );
// };