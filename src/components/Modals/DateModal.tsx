import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";

interface DateModalProps {
  isEditingDate: boolean;
  setIsEditingDate: (value: boolean) => void;
  dateListen: string;
  setDateListen: (date: string) => void;
}

export const DateModal: React.FC<DateModalProps> = ({ isEditingDate, setIsEditingDate, dateListen, setDateListen }) => {
    const defaultStyles = useDefaultStyles('light');
    
    return (
        <Modal
            visible={isEditingDate}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Date</Text>
                </View>
                <TouchableOpacity 
                  style={styles.doneButton}
                  onPress={() => {setIsEditingDate(false);}}
                >
                    <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
                <DateTimePicker
                    mode="single"
                    date={dateListen}
                    onChange={({ date }) => setDateListen(date?.toString() || '')}
                    styles={defaultStyles}
                />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  doneButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  doneButtonText: {
    fontSize: 16,
    color: '#0047FF',
    fontWeight: '600',
  },
  modalCloseButton: {
    fontSize: 16,
    color: '#0047FF',
    fontWeight: '600',
  },
});