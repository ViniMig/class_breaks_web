import eel
from _classroom import Classroom
from _student import Student
import json
from datetime import date

class EelInterface:

    @eel.expose
    def __init__(self):

        self.eel = eel
        self.eel.init("web")
        #read the classroom json
        with open('classroom.json') as classroom:
            self.classroom_json = json.load(classroom)
        
        #set current classroom class
        self.current_class = Classroom(self.classroom_json["students"])
        self.current_class.check_today()
        self.get_classroom_info()

    @eel.expose
    def get_classroom_info(self):
        """Initializes the UI with the data from any existing classroom."""
        for member in self.current_class.students:
            name_member = member.name
            breaks = member.today_breaks
            break_times = str(member.today_total_time) + member.time_units
            id_member = member.student_id
            eel.createBtns(name_member, breaks, break_times, id_member)

    @eel.expose
    def add_new_member(self, member_name: str):
        """Creates new Member in the Classroom with the given name"""
        highest_id = 0
        studentExists = False

        for student in self.current_class:
            if student.name == member_name:
                studentExists = True
                break

            if student.student_id > highest_id:
                highest_id = student.student_id

        if not(studentExists):
            print(f"Creating {member_name} with ID {highest_id + 1}")
            student_to_add = Student(highest_id + 1, member_name, [{"date": str(date.today()), "num_breaks": 0, "total_break_time": 0}])
            self.current_class.add_student(student_to_add)
            #update json file
            self.update_classroom_json()
            eel.memberAdded(True, member_name, highest_id + 1)
        else:
            eel.memberAdded(False, member_name, 0)
            print(f"Student {member_name} already exists!")

    @eel.expose
    def start_clock(self, member_id: int):
        """Starts counting time for given student id"""
        self.current_class.students[member_id].start_counting()

    @eel.expose
    def stop_clock(self, member_id: int):
        """Stops counting time for given student id"""
        self.current_class.students[member_id].stop_counting() 
        new_total_breaks = self.current_class.students[member_id].today_breaks
        new_total_time = str(self.current_class.students[member_id].today_total_time) + self.current_class.students[member_id].time_units
        member_id += 1 #return to original id so send to javascript
        eel.updateInfoBreaks(member_id, new_total_breaks, new_total_time)
    
    def update_classroom_json(self):
        """Called when adding new student from GUI. Saves updated json classroom."""
        print("Updating classroom json.")
        data_json = {
            "students": self.current_class.classroom_json_list()
        }

        data_json_dumps = json.dumps(data_json)
        with open('classroom.json', 'w') as save_class:
            save_class.write(data_json_dumps)

    @eel.expose
    def start_ui(self):
        self.eel.start("index.html", class_instance=self)