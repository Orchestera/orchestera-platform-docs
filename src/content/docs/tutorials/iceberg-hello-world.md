---
title: Using Iceberg tables with Spark
description: Writing your first hello-world Spark pipeline using Orchestera Platform
---

This tutorial demonstrates integrating, reading and writing from Iceberg tables using the same public dataset from the hello-world tutorial.

**Note: You should be logged into the member account for the following steps**


## Prerequisites

This tutorial assumes the following:

1. You have given your Spark cluster access to S3 by using the steps defined in [Giving S3 access](/guides/giving-access-to-s3/).
2. You have IAM credentials setup for a user that's member of the `orchestera-platform-devs` and you have successfully verified your kubectl CLI permissions as documented [here](/guides/user-access-to-spark-cluster/).
3. You have cloned the repo at https://github.com/Orchestera/orchestera-hello-world.git
4. You have created a sample S3 bucket in your member account. Remember to plug in your bucket name in `<your-bucket-name>` in the code below.
5. You have created an ECR repo called `hello-world` in your member account and have noted the repo URI `<member-account-id>.dkr.ecr.us-east-1.amazonaws.com/hello-world`
6. Installed `uv` on your local machine. See this link: https://docs.astral.sh/uv/getting-started/installation/#installing-uv

From your local `orchestera-hello-world` directory, run the following:


```bash
make venv
source .venv/bin/activate
```

## Pipeline code

Update the `src/example/spark/iceberg.py` with the following, replacing `<your-bucket-name>` with your actual S3 bucket.

```python

import logging

from orchestera.spark.session import OrchesteraSparkSession
from orchestera.entrypoints.sparklith_entrypoint import SparklithEntryPoint
from orchestera.entrypoints.base_entrypoint import StringArg

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class IcebergS3Example(SparklithEntryPoint):

    application_name = StringArg(required=True, tooltip="Name of the application")

    def run(self):
        """Code entrypoint for Iceberg S3 example"""

        bucket = "<your-bucket-name>"
        warehouse_path = f"s3a://{bucket}/iceberg-warehouse"

        # Iceberg runtime packages (compatible with Spark 3.5)
        # See: https://iceberg.apache.org/releases/
        iceberg_version = "1.10.1"
        iceberg_packages = ",".join([
            f"org.apache.iceberg:iceberg-spark-runtime-3.5_2.12:{iceberg_version}",
            f"org.apache.iceberg:iceberg-aws-bundle:{iceberg_version}",
        ])

        # Iceberg-specific Spark configuration
        iceberg_conf = {
            # Include Iceberg JARs at runtime
            "spark.jars.packages": iceberg_packages,
            # Catalog configuration
            "spark.sql.catalog.spark_catalog": "org.apache.iceberg.spark.SparkSessionCatalog",
            "spark.sql.catalog.spark_catalog.type": "hive",
            "spark.sql.catalog.local": "org.apache.iceberg.spark.SparkCatalog",
            "spark.sql.catalog.local.type": "hadoop",
            "spark.sql.catalog.local.warehouse": warehouse_path,
            "spark.sql.extensions": "org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions",
        }

        with OrchesteraSparkSession(
            app_name="IcebergS3Example",
            executor_instances=4,
            executor_cores=2,
            executor_memory="8g",
            additional_spark_conf=iceberg_conf,
        ) as spark:
            spark.sparkContext.setLogLevel("ERROR")

            # Read sample data from publicly available S3
            df = spark.read.parquet(
                "s3a://ookla-open-data/parquet/performance/type=fixed/year=2019/quarter=1/2019-01-01_performance_fixed_tiles.parquet"
            ).limit(1000)

            logger.info("Sample data schema:")
            df.printSchema()
            df.show(5)

            # Create Iceberg table and write data
            table_name = "local.example.ookla_performance"

            # Create namespace if it doesn't exist
            spark.sql("CREATE NAMESPACE IF NOT EXISTS local.example")

            # Write DataFrame as Iceberg table
            df.writeTo(table_name).createOrReplace()
            logger.info(f"Created Iceberg table: {table_name}")

            # Read back from Iceberg table
            iceberg_df = spark.table(table_name)
            logger.info("Reading from Iceberg table:")
            iceberg_df.show(5)

            # Demonstrate Iceberg SQL features
            # Append more data
            df.writeTo(table_name).append()
            logger.info("Appended data to Iceberg table")

            # Show table history (time travel metadata)
            spark.sql(f"SELECT * FROM {table_name}.history").show()

            # Show table snapshots
            spark.sql(f"SELECT * FROM {table_name}.snapshots").show()

            logger.info("Iceberg S3 example completed successfully")


```

## Building and Pushing the image to your ECR repo

Make sure to replace all instances of `member-account-id` with your actual account id that's part of your ECR URI

```bash
make build-userapp && make push-userapp ECR_REGISTRY=<member-account-id>.dkr.ecr.us-east-1.amazonaws.com
```


## Running the pipeline via Orchestera CLI

Now, you can run your lake pipeline using the following command:


```bash
uv run python -m orchestera.clients.sync_client run \
  --namespace "<your-namespace>" \
  --image "<member-account-id>.dkr.ecr.us-east-1.amazonaws.com/hello-world:userapp" \
  --classpath "example.spark.iceberg.IcebergS3Example" \
  --memory-request 2G \
  --cpu-request 2 \
  --application-name "spark-hello-world-iceberg"
```


Congratulations! You have successfully integrated Iceberg tables in your Spark pipeline!
