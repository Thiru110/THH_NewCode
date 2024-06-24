import google.generativeai as genai
import mysql.connector
 
def db_retrieve(ID, Name):
    try:
        mydb = mysql.connector.connect(
            host="192.168.0.195",
            user="root",
            database="Antony",
            password="root123",
            port="3306",
            auth_plugin='mysql_native_password'
        )
        mycursor = mydb.cursor()
        sql = "SELECT Resume FROM candidate_info WHERE Job_ID=%s AND Name=%s;"
        val = (ID, Name)
        mycursor.execute(sql, val)
        resume = mycursor.fetchone()
        if resume:
            resume = resume[0]  
        sql1 = "SELECT skillset FROM job_detail WHERE Job_ID=%s;"
        val1 = (ID,)
        mycursor.execute(sql1, val1)
        skillset = mycursor.fetchone()
        if skillset:
            skillset = skillset[0]  
 
        return resume, skillset  
    except mysql.connector.Error as err:
        return f"Database Error: {err}", None
    except Exception as e:
        return f"Error: {e}", None
    finally:
        mycursor.close()
        mydb.close()
 
 
 
def relative_ranking(resume, skillset):
    try:
        # Read the prompt content from the file
        with open(r"promt.txt", 'r', encoding='utf-8') as prompt_file:
            prompt_content = prompt_file.read()
 
        # Create the question with the provided paths and prompt content
        question = f"""
        Sample: {prompt_content}
        Skillset Content: {skillset}\n
        Resume Content: {resume}\n
        Test Answer:"""
 
        # Configure the generative AI model
        genai.configure(api_key="AIzaSyDTXKlJq27fF0AiTvw7rK302TLCzNVwFQw")
        model = genai.GenerativeModel('gemini-pro')
 
        # Generate the content based on the question
        response = model.generate_content(question)
        print(response.text)
        return response.text
    except Exception as e:
        return f"Error: {e}"